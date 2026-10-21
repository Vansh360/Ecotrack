import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import Mock, patch

import numpy as np

from app import fetch_hourly_history, fit_and_forecast


class ForecastDataQualityTest(unittest.TestCase):
    @patch("app.API_KEY", "test-key")
    @patch("app.requests.get")
    def test_forecast_reports_observed_coverage_before_interpolation(
        self, get
    ):
        end = datetime.now(timezone.utc).replace(
            minute=0, second=0, microsecond=0
        )
        start = end - timedelta(hours=400)
        results = []

        for hour in range(400):
            timestamp = start + timedelta(hours=hour)
            if hour == 200:
                continue
            results.append(
                {
                    "datetimeFrom": {"utc": timestamp.isoformat()},
                    "value": 10 + np.sin(hour / 24),
                }
            )

        response = Mock()
        response.json.return_value = {"results": results}
        get.return_value = response

        history, observed_fraction = fetch_hourly_history(123)
        result = fit_and_forecast(history, observed_fraction)

        self.assertEqual(history["pm25"].isna().sum(), 0)
        self.assertEqual(result["dataQuality"]["usableHourlyObservations"], 400)
        self.assertEqual(
            result["dataQuality"]["observedCoveragePercent"], 99.8
        )


if __name__ == "__main__":
    unittest.main()
