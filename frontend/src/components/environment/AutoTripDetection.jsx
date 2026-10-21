import { useEffect, useRef, useState } from "react";
import { MapPin, Save, Square, CirclePlay } from "lucide-react";

import { useActivities } from "../../context/ActivityContext";
import { calculateTransportationEmission } from "../../utils/carbonCalculator";
import { getDistanceMeters, inferTravelMode } from "../../utils/gpsTripDetection";
import "./AutoTripDetection.css";

const MINIMUM_ACCURACY_METERS = 50;

export default function AutoTripDetection() {
  const { addActivity } = useActivities();
  const watchIdRef = useRef(null);
  const pointsRef = useRef([]);
  const previousPointRef = useRef(null);
  const distanceAnchorRef = useRef(null);
  const distanceMetersRef = useRef(0);
  const startedAtRef = useRef(null);

  const [isTracking, setIsTracking] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [inference, setInference] = useState({ mode: null, confidence: "low" });
  const [confirmedMode, setConfirmedMode] = useState("");
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function clearWatch() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }

  useEffect(() => () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  }, []);

  function handlePosition(position) {
    const { latitude, longitude, accuracy } = position.coords;
    if (accuracy > MINIMUM_ACCURACY_METERS) {
      return;
    }

    const point = {
      latitude,
      longitude,
      timestamp: position.timestamp,
    };
    const previous = previousPointRef.current;

    if (previous) {
      const elapsedSeconds = (point.timestamp - previous.timestamp) / 1000;
      if (elapsedSeconds <= 0) {
        return;
      }
      const segmentDistance = getDistanceMeters(previous, point);
      if (segmentDistance / elapsedSeconds > 45) {
        return;
      }
    } else {
      distanceAnchorRef.current = point;
    }

    const distanceFromAnchor = getDistanceMeters(distanceAnchorRef.current, point);
    if (distanceFromAnchor >= 3) {
      distanceMetersRef.current += distanceFromAnchor;
      distanceAnchorRef.current = point;
      setDistanceMeters(distanceMetersRef.current);
    }

    previousPointRef.current = point;
    pointsRef.current.push(point);

    const detected = inferTravelMode(pointsRef.current);
    setInference(detected);
    if (detected.mode) {
      setConfirmedMode(detected.mode);
    }
  }

  function handlePositionError(positionError) {
    clearWatch();
    setIsTracking(false);
    setError(positionError.message || "Could not access your location.");
  }

  function startTracking() {
    setError("");
    setTrip(null);
    setConfirmedMode("");
    setInference({ mode: null, confidence: "low" });
    pointsRef.current = [];
    previousPointRef.current = null;
    distanceAnchorRef.current = null;
    distanceMetersRef.current = 0;
    setDistanceMeters(0);

    if (!navigator.geolocation) {
      setError("GPS tracking is not supported by this browser.");
      return;
    }

    startedAtRef.current = new Date();
    setIsTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handlePositionError,
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    );
  }

  function stopTracking() {
    clearWatch();
    setIsTracking(false);
    setTrip({
      distanceKm: distanceMetersRef.current / 1000,
      startedAt: startedAtRef.current,
    });
    if (!distanceMetersRef.current) {
      setError("No reliable GPS distance was recorded. Try again with a clearer GPS signal.");
    }
  }

  async function saveTrip() {
    if (!trip || trip.distanceKm <= 0 || !confirmedMode) {
      setError("Record a trip and confirm the travel mode before saving.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const result = confirmedMode === "Walk"
        ? { emission: 0 }
        : calculateTransportationEmission({
            vehicle: confirmedMode,
            distance: trip.distanceKm,
            frequency: "One Time",
            passengers: 1,
          });

      const activityDate = trip.startedAt;
      const localDate = [
        activityDate.getFullYear(),
        String(activityDate.getMonth() + 1).padStart(2, "0"),
        String(activityDate.getDate()).padStart(2, "0"),
      ].join("-");

      await addActivity({
        category: "Transportation",
        activityType: confirmedMode,
        quantity: trip.distanceKm,
        unit: "km",
        activityDate: localDate,
        details: `GPS trip estimate; travel mode confirmed by user. Distance: ${trip.distanceKm.toFixed(2)} km.`,
        emission: result.emission,
      });
      setTrip(null);
      setConfirmedMode("");
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message || "Unable to save this trip.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="auto-trip-card" aria-labelledby="auto-trip-title">
      <div className="auto-trip-heading">
        <span className="auto-trip-icon"><MapPin size={20} /></span>
        <div>
          <h2 id="auto-trip-title">Auto trip detection</h2>
          <p>Use GPS while this page is open to estimate trip distance and travel mode.</p>
        </div>
      </div>

      <p className="auto-trip-privacy">
        Tracking runs only after you start it and stops when you stop tracking or leave this page.
        GPS coordinates are used in memory to estimate the trip and are not saved.
      </p>

      <div className="auto-trip-actions">
        {!isTracking ? (
          <button type="button" className="calculate-button" onClick={startTracking}>
            <CirclePlay size={16} /> Start GPS tracking
          </button>
        ) : (
          <button type="button" className="auto-trip-stop" onClick={stopTracking}>
            <Square size={15} /> Stop and review trip
          </button>
        )}
        <strong>{(distanceMeters / 1000).toFixed(2)} km</strong>
        {isTracking && <span className="auto-trip-live">Recording</span>}
      </div>

      {(isTracking || trip) && (
        <div className="auto-trip-review">
          <p>
            Best GPS estimate: <strong>{inference.mode || "Gathering movement data..."}</strong>
            {inference.mode && ` (${inference.confidence} confidence)`}
          </p>
          <label htmlFor="auto-trip-mode">Confirm or correct travel mode</label>
          <select
            id="auto-trip-mode"
            value={confirmedMode}
            onChange={(event) => setConfirmedMode(event.target.value)}
            disabled={isTracking}
          >
            <option value="">Select mode</option>
            <option value="Walk">Walk</option>
            <option value="Bus">Bus</option>
            <option value="Car">Car</option>
            <option value="Train">Train</option>
          </select>
          {(inference.mode === "Bus" || inference.mode === "Car") && (
            <small>
              Bus and car movement patterns overlap; GPS alone may not distinguish them accurately.
            </small>
          )}
          {trip && (
            <button
              type="button"
              className="save-activity-button"
              onClick={saveTrip}
              disabled={saving || !confirmedMode || trip.distanceKm <= 0}
            >
              <Save size={15} /> {saving ? "Saving trip..." : "Confirm and save trip"}
            </button>
          )}
        </div>
      )}

      {error && <p className="auto-trip-error" role="alert">{error}</p>}
    </section>
  );
}
