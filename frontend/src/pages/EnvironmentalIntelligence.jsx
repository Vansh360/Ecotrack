import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RefreshCw } from "lucide-react";

import { getIndianAirQuality } from "../services/environmentalService";
import "./EnvironmentalIntelligence.css";

const FireHotspotMap = lazy(
  () => import("../components/environment/FireHotspotMap")
);

function formatMeasurementTime(value) {
  if (!value) {
    return "Time not provided";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function formatError(error) {
  if (error.response?.status === 401) {
    return "Your session may have expired. Please log in again.";
  }

  return error.response?.data?.message
    || error.message
    || "Could not load environmental data.";
}

export default function EnvironmentalIntelligence() {
  const [readings, setReadings] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("highest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleReadingsLoaded = useCallback((data) => {
    setReadings(data);
    setLastUpdated(new Date());
  }, []);

  const handleReadingsError = useCallback((requestError) => {
    setError(formatError(requestError));
  }, []);

  const loadReadings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      handleReadingsLoaded(await getIndianAirQuality());
    } catch (requestError) {
      handleReadingsError(requestError);
    } finally {
      setLoading(false);
    }
  }, [handleReadingsError, handleReadingsLoaded]);

  useEffect(() => {
    let cancelled = false;

    getIndianAirQuality()
      .then((data) => {
        if (!cancelled) {
          handleReadingsLoaded(data);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          handleReadingsError(requestError);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [handleReadingsError, handleReadingsLoaded]);

  const filteredReadings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...readings]
      .filter((item) => (
        `${item.location || ""} ${item.region || ""}`
          .toLowerCase()
          .includes(query)
      ))
      .sort((first, second) => {
        const firstValue = Number(first.pm25 ?? -1);
        const secondValue = Number(second.pm25 ?? -1);
        return sortOrder === "highest"
          ? secondValue - firstValue
          : firstValue - secondValue;
      });
  }, [readings, search, sortOrder]);

  const highestReading = readings.reduce((highest, item) => {
    if (item.pm25 == null) {
      return highest;
    }
    return highest == null || item.pm25 > highest ? item.pm25 : highest;
  }, null);

  return (
    <div className="environment-page">
      <section className="environment-hero">
        <div>
          <span className="environment-eyebrow">ECOTRACK · INDIA</span>
          <h1>Environmental Intelligence</h1>
          <p>
            Explore the latest available PM2.5 measurements from
            Indian air-quality monitoring stations.
          </p>
        </div>

        <button
          className="environment-refresh"
          type="button"
          onClick={loadReadings}
          disabled={loading}
        >
          <RefreshCw size={16} aria-hidden="true" />
          {loading ? "Loading…" : "Refresh data"}
        </button>
      </section>

      <section className="environment-stats" aria-label="Air quality summary">
        <article className="environment-stat">
          <span>Monitoring stations</span>
          <strong>{readings.length}</strong>
          <small>Stations with returned readings</small>
        </article>

        <article className="environment-stat">
          <span>Highest PM2.5 reading</span>
          <strong>
            {highestReading == null ? "—" : highestReading.toFixed(1)}
          </strong>
          <small>µg/m³ · among returned readings</small>
        </article>

        <article className="environment-stat">
          <span>Last data fetch</span>
          <strong className="environment-time">
            {lastUpdated
              ? lastUpdated.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </strong>
          <small>
            {lastUpdated
              ? lastUpdated.toLocaleDateString("en-IN")
              : "Not fetched yet"}
          </small>
        </article>
      </section>

      <Suspense
        fallback={
          <div className="environment-message" role="status">
            Loading the fire hotspot map…
          </div>
        }
      >
        <FireHotspotMap />
      </Suspense>

      <section className="environment-data-panel">
        <div className="environment-panel-heading">
          <div>
            <h2>Indian air-quality stations</h2>
            <p>
              Higher readings appear first by default. Availability and
              measurement times vary by station.
            </p>
          </div>
        </div>

        <div className="environment-filters">
          <input
            type="search"
            placeholder="Search station or region…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search stations"
          />

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            aria-label="Sort PM2.5 readings"
          >
            <option value="highest">Highest PM2.5 first</option>
            <option value="lowest">Lowest PM2.5 first</option>
          </select>
        </div>

        {error && (
          <div className="environment-message environment-error" role="alert">
            <strong>Unable to load live data</strong>
            <p>{error}</p>
            <button type="button" onClick={loadReadings}>Try again</button>
          </div>
        )}

        {loading && readings.length === 0 && !error && (
          <div className="environment-message" role="status">
            Loading the latest available measurements…
          </div>
        )}

        {!loading && !error && filteredReadings.length === 0 && (
          <div className="environment-message">
            {readings.length === 0
              ? "No readings were returned. Check the API key and data-provider availability."
              : "No stations match your search."}
          </div>
        )}

        {filteredReadings.length > 0 && (
          <div className="environment-table-wrap">
            <table className="environment-table">
              <thead>
                <tr>
                  <th scope="col">Station</th>
                  <th scope="col">Region</th>
                  <th scope="col">PM2.5</th>
                  <th scope="col">Coordinates</th>
                  <th scope="col">Measurement time</th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.map((item) => (
                  <tr key={item.locationId}>
                    <td>
                      <strong>{item.location || "Unknown station"}</strong>
                    </td>
                    <td>{item.region || "India"}</td>
                    <td>
                      <span className="environment-reading">
                        {item.pm25 == null
                          ? "—"
                          : Number(item.pm25).toFixed(1)}
                        {item.pm25 != null && (
                          <small> {item.unit || "µg/m³"}</small>
                        )}
                      </span>
                    </td>
                    <td>
                      {item.latitude != null && item.longitude != null ? (
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${item.latitude}&mlon=${item.longitude}#map=12/${item.latitude}/${item.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View map
                        </a>
                      ) : (
                        "Unavailable"
                      )}
                    </td>
                    <td>{formatMeasurementTime(item.measuredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="environment-attribution">
          Data provider: OpenAQ. These are PM2.5 concentrations, not official
          CPCB AQI values. Refreshing fetches the provider data again; it does
          not guarantee the underlying station readings have changed.
        </footer>
      </section>
    </div>
  );
}
