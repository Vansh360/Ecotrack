import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";

import { getFireHotspots } from "../../services/environmentalService";
import "leaflet/dist/leaflet.css";

const PERIODS = [
  { value: "24h", label: "Past 24 hours" },
  { value: "48h", label: "Past 48 hours" },
  { value: "7d", label: "Past 7 days" },
];

function formatDetectionTime(value) {
  if (!value) {
    return "Time not provided";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
        timeZoneName: "short",
      });
}

function formatError(error) {
  return error.response?.data?.detail
    || error.response?.data?.message
    || error.message
    || "Could not load NASA FIRMS fire detections.";
}

export default function FireHotspotMap() {
  const [period, setPeriod] = useState("24h");
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getFireHotspots(period)
      .then((data) => {
        if (!cancelled) {
          setHotspots(data);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(formatError(requestError));
          setHotspots([]);
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
  }, [period, refreshKey]);

  return (
    <section className="fire-hotspot-panel" aria-labelledby="fire-hotspot-title">
      <div className="fire-hotspot-heading">
        <div>
          <span className="fire-hotspot-eyebrow">
            NASA FIRMS · INDIA
          </span>
          <h2 id="fire-hotspot-title">Forest fire &amp; environmental hotspots</h2>
          <p>
            Satellite-detected active-fire locations are shown on a separate
            map layer from air-quality readings. Select a marker to inspect its
            detection details.
          </p>
        </div>

        <div className="fire-hotspot-controls">
          <label htmlFor="fire-hotspot-period">Detection window</label>
          <select
            id="fire-hotspot-period"
            value={period}
            onChange={(event) => {
              setLoading(true);
              setError("");
              setPeriod(event.target.value);
            }}
          >
            {PERIODS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className="environment-refresh"
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              setRefreshKey((current) => current + 1);
            }}
            disabled={loading}
            aria-label="Refresh fire hotspot detections"
          >
            <RefreshCw size={16} aria-hidden="true" />
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="fire-hotspot-map-wrap">
        <MapContainer
          center={[22.5, 79]}
          zoom={4}
          minZoom={3}
          maxZoom={12}
          scrollWheelZoom={false}
          className="fire-hotspot-map"
          aria-label="Map of NASA FIRMS active-fire detections in India"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hotspots.map((hotspot, index) => (
            <CircleMarker
              key={`${hotspot.detectedAt}-${hotspot.latitude}-${hotspot.longitude}-${hotspot.satelliteSource}-${index}`}
              center={[hotspot.latitude, hotspot.longitude]}
              radius={7}
              pathOptions={{
                color: "#a83218",
                fillColor: "#f26b38",
                fillOpacity: 0.78,
                weight: 1.5,
              }}
            >
              <Popup>
                <dl className="fire-hotspot-popup">
                  <dt>Coordinates</dt>
                  <dd>
                    {Number(hotspot.latitude).toFixed(5)},{" "}
                    {Number(hotspot.longitude).toFixed(5)}
                  </dd>
                  <dt>Detection time</dt>
                  <dd>
                    <time dateTime={hotspot.detectedAt}>
                      {formatDetectionTime(hotspot.detectedAt)}
                    </time>
                  </dd>
                  <dt>Satellite source</dt>
                  <dd>{hotspot.satelliteSource || "Not provided"}</dd>
                  <dt>Confidence</dt>
                  <dd>{hotspot.confidence || "Not provided"}</dd>
                </dl>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="fire-hotspot-map-status" aria-live="polite">
          {loading && <span role="status">Loading fire detections…</span>}
          {!loading && error && (
            <div className="fire-hotspot-error" role="alert">
              <strong>Fire detections are unavailable</strong>
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && hotspots.length === 0 && (
            <span>No detections were returned for this period.</span>
          )}
        </div>
        <div className="fire-hotspot-legend" aria-hidden="true">
          <span />
          Active-fire detection
        </div>
      </div>

      <p className="fire-hotspot-caveat">
        NASA FIRMS active-fire detections are satellite observations, not
        definitive confirmation of a ground fire. Confidence is displayed
        only when supplied by the source.
      </p>
      <p className="fire-hotspot-attribution">
        Fire data: NASA FIRMS (near-real-time VIIRS detections). Map tiles:
        OpenStreetMap contributors.
      </p>
    </section>
  );
}
