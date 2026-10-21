
import os
from datetime import datetime, timedelta, timezone

import numpy as np
import pandas as pd
import requests
from fastapi import FastAPI, HTTPException, Query
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

app = FastAPI(
    title="EcoTrack AI Pollution Forecast",
    version="1.0.0",
    description="Historical PM2.5 analysis and 24-hour station forecasts",
)

OPENAQ_URL = "https://api.openaq.org/v3"
API_KEY = os.getenv("OPENAQ_API_KEY")

MIN_HOURS = 24 * 14
LAGS = [1, 2, 3, 6, 12, 24, 48, 168]


def fetch_hourly_history(sensor_id: int) -> tuple[pd.DataFrame, float]:
    """Fetch recent hourly PM2.5 history for one OpenAQ sensor."""
    if not API_KEY:
        raise HTTPException(
            status_code=503,
            detail="OPENAQ_API_KEY is not configured for the forecasting service.",
        )

    now = datetime.now(timezone.utc)
    start = now - timedelta(days=40)

    try:
        response = requests.get(
            f"{OPENAQ_URL}/sensors/{sensor_id}/hours",
            headers={"X-API-Key": API_KEY},
            params={
                "datetime_from": start.isoformat(),
                "datetime_to": now.isoformat(),
                "limit": 1000,
                "page": 1,
            },
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not retrieve historical OpenAQ measurements: {exc}",
        ) from exc

    rows = []

    for item in payload.get("results", []):
        value = item.get("value")
        dt_from = item.get("datetimeFrom") or {}

        timestamp = dt_from.get("utc") or dt_from.get("local")

        if timestamp is None or value is None:
            continue

        try:
            value = float(value)
            timestamp = pd.to_datetime(timestamp, utc=True)
        except (TypeError, ValueError):
            continue

        # Reject impossible values; retain valid high readings for review.
        if not np.isfinite(value) or value < 0 or value > 2000:
            continue

        rows.append({"time": timestamp, "pm25": value})

    if not rows:
        raise HTTPException(
            status_code=422,
            detail="No usable hourly PM2.5 history was returned for this sensor.",
        )

    df = pd.DataFrame(rows)
    df = (
        df.drop_duplicates(subset="time", keep="last")
        .sort_values("time")
        .set_index("time")
    )

    # Create a continuous hourly index. Do not invent missing PM2.5 values.
    hourly_index = pd.date_range(
        df.index.min().floor("h"),
        df.index.max().floor("h"),
        freq="h",
        tz="UTC",
    )
    df = df.reindex(hourly_index)
    df.index.name = "time"

    # Small gaps can be interpolated for training, but the model must still
    # meet a minimum observed-data coverage requirement.
    observed_fraction = float(df["pm25"].notna().mean())

    if observed_fraction < 0.75:
        raise HTTPException(
            status_code=422,
            detail=(
                "Insufficient data coverage for a reliable forecast. "
                "This station has too many missing hourly readings."
            ),
        )

    # Only interpolate short gaps; never bridge a long data outage.
    df["pm25"] = df["pm25"].interpolate(
        method="time",
        limit=2,
        limit_area="inside",
    )

    return df, observed_fraction


def build_features(series: pd.Series) -> pd.DataFrame:
    """Create lag, daily-cycle and weekly-cycle predictors."""
    frame = pd.DataFrame(index=series.index)

    for lag in LAGS:
        frame[f"lag_{lag}"] = series.shift(lag)

    hour = frame.index.hour
    day_of_week = frame.index.dayofweek

    frame["hour_sin"] = np.sin(2 * np.pi * hour / 24)
    frame["hour_cos"] = np.cos(2 * np.pi * hour / 24)
    frame["weekday_sin"] = np.sin(2 * np.pi * day_of_week / 7)
    frame["weekday_cos"] = np.cos(2 * np.pi * day_of_week / 7)

    return frame


def fit_and_forecast(df: pd.DataFrame, observed_fraction: float) -> dict:
    series = df["pm25"].dropna().astype(float)

    if len(series) < MIN_HOURS:
        raise HTTPException(
            status_code=422,
            detail=(
                f"This station needs at least {MIN_HOURS} usable hourly "
                f"observations (14 days); only {len(series)} are available."
            ),
        )

    features = build_features(series)
    dataset = features.copy()
    dataset["target"] = series

    dataset = dataset.dropna()

    if len(dataset) < 100:
        raise HTTPException(
            status_code=422,
            detail="Not enough complete historical rows remain after feature creation.",
        )

    X = dataset.drop(columns="target")
    y = dataset["target"]

    # Chronological holdout: never shuffle time-series data.
    split = int(len(dataset) * 0.80)
    if split <= 0 or len(dataset) - split < 24:
        raise HTTPException(
            status_code=422,
            detail="Not enough data for a chronological validation period.",
        )

    X_train, X_test = X.iloc[:split], X.iloc[split:]
    y_train, y_test = y.iloc[:split], y.iloc[split:]

    validation_model = RandomForestRegressor(
        n_estimators=250,
        min_samples_leaf=2,
        max_features=0.9,
        random_state=42,
        n_jobs=-1,
    )
    validation_model.fit(X_train, y_train)

    test_predictions = validation_model.predict(X_test)

    mae = float(mean_absolute_error(y_test, test_predictions))
    rmse = float(np.sqrt(mean_squared_error(y_test, test_predictions)))

    # Approximate 90% prediction interval from chronological holdout errors.
    residuals = np.abs(y_test.to_numpy() - test_predictions)
    error_90 = float(np.quantile(residuals, 0.90))

    # Train the final model on all available supervised history.
    model = RandomForestRegressor(
        n_estimators=250,
        min_samples_leaf=2,
        max_features=0.9,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X, y)

    history = series.copy()
    forecasts = []

    last_time = history.index.max()
    last_observed = float(history.iloc[-1])

    for step in range(1, 25):
        future_time = last_time + pd.Timedelta(hours=step)

        row = {}
        for lag in LAGS:
            lag_time = future_time - pd.Timedelta(hours=lag)
            row[f"lag_{lag}"] = history.get(lag_time, np.nan)

        row["hour_sin"] = np.sin(2 * np.pi * future_time.hour / 24)
        row["hour_cos"] = np.cos(2 * np.pi * future_time.hour / 24)
        row["weekday_sin"] = np.sin(
            2 * np.pi * future_time.dayofweek / 7
        )
        row["weekday_cos"] = np.cos(
            2 * np.pi * future_time.dayofweek / 7
        )

        # If a required lag is unavailable, do not silently fabricate a forecast.
        if any(pd.isna(value) for value in row.values()):
            raise HTTPException(
                status_code=422,
                detail="Not enough continuous recent history to create the 24-hour forecast.",
            )

        prediction = float(model.predict(pd.DataFrame([row]))[0])
        prediction = max(0.0, prediction)

        forecasts.append({
            "time": future_time.isoformat(),
            "predictedPm25": round(prediction, 2),
            "lower90": round(max(0.0, prediction - error_90), 2),
            "upper90": round(prediction + error_90, 2),
        })

        # Recursive forecast: later hours use earlier predictions.
        history.loc[future_time] = prediction

    importances = sorted(
        [
            {"feature": name, "importance": round(float(score), 4)}
            for name, score in zip(X.columns, model.feature_importances_)
        ],
        key=lambda item: item["importance"],
        reverse=True,
    )

    return {
        "unit": "µg/m³",
        "lastObservedTime": last_time.isoformat(),
        "lastObservedPm25": round(last_observed, 2),
        "forecast": forecasts,
        "validation": {
            "method": "chronological 80/20 holdout",
            "trainingRows": int(len(X_train)),
            "testRows": int(len(X_test)),
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "approximate90PercentAbsoluteError": round(error_90, 2),
        },
        "importantFeatures": importances[:8],
        "dataQuality": {
            "usableHourlyObservations": int(series.size),
            "observedCoveragePercent": round(observed_fraction * 100, 1),
        },
        "model": "RandomForestRegressor",
        "note": (
            "Forecasts are estimates, not official AQI values. "
            "The interval is an approximate historical-error band, "
            "not a guaranteed probability interval. Recursive forecasts "
            "may become less accurate further into the future."
        ),
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "ecotrack-pollution-forecast"}


@app.get("/forecast/{sensor_id}")
def forecast(
    sensor_id: int,
    station_name: str = Query(default="Selected station", max_length=150),
):
    if sensor_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid sensor ID.")

    df, observed_fraction = fetch_hourly_history(sensor_id)
    result = fit_and_forecast(df, observed_fraction)
    result["sensorId"] = sensor_id
    result["stationName"] = station_name
    return result
