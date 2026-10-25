import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./eco-visuals.css";

// kg CO2e per passenger-km (approximate averages; replace with your cited dataset)
const MODES = [
  { id: "walk", label: "Walking", icon: "🚶", maxKmh: 7, factor: 0 },
  { id: "bike", label: "Cycling", icon: "🚲", maxKmh: 25, factor: 0 },
  { id: "bus", label: "Bus", icon: "🚌", maxKmh: 45, factor: 0.1 },
  { id: "car", label: "Car", icon: "🚗", maxKmh: Infinity, factor: 0.174 },
];
const CAR_FACTOR = 0.174;
const START = [18.5204, 73.8567]; // map centre before the first GPS fix (change to your city)

function distanceKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// Smoothly animate a number towards its target
function useCountUp(target, ms = 500) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const begin = from.current;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / ms);
      const v = begin + (target - begin) * (1 - (1 - p) ** 3);
      setValue(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

// Keeps the map centred on the latest point
function Follow({ point }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lon], Math.max(map.getZoom(), 16), { duration: 0.8 });
  }, [point, map]);
  return null;
}

export default function LiveTripMap({ onSave }) {
  const [points, setPoints] = useState([]); // { lat, lon, t }
  const [running, setRunning] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [modeId, setModeId] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const watchRef = useRef(null);
  const simRef = useRef(null);

  const stats = useMemo(() => {
    let km = 0;
    for (let i = 1; i < points.length; i++) km += distanceKm(points[i - 1], points[i]);
    const first = points[0];
    const last = points[points.length - 1];
    const hours = first && last ? (last.t - first.t) / 3600000 : 0;
    const avg = hours > 0 ? km / hours : 0;
    const recent = points.slice(-5);
    let recentKm = 0;
    for (let i = 1; i < recent.length; i++) recentKm += distanceKm(recent[i - 1], recent[i]);
    const recentH = recent.length > 1 ? (recent[recent.length - 1].t - recent[0].t) / 3600000 : 0;
    return { km, avg, now: recentH > 0 ? recentKm / recentH : 0, minutes: hours * 60 };
  }, [points]);

  const guessed = MODES.find((m) => stats.avg <= m.maxKmh);
  const mode = MODES.find((m) => m.id === modeId) || guessed;
  const co2 = stats.km * mode.factor;
  const carCo2 = stats.km * CAR_FACTOR;
  const savedCo2 = Math.max(0, carCo2 - co2);

  const shownKm = useCountUp(stats.km);
  const shownCo2 = useCountUp(co2);
  const shownSaved = useCountUp(savedCo2);

  function reset() {
    setPoints([]);
    setSaved(false);
    setError("");
    setModeId("");
  }

  function startReal() {
    if (!navigator.geolocation) return setError("GPS is not available in this browser.");
    reset();
    setSimulated(false);
    setRunning(true);
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy > 50) return; // ignore weak fixes
        const p = { lat: pos.coords.latitude, lon: pos.coords.longitude, t: Date.now() };
        setPoints((cur) => {
          const last = cur[cur.length - 1];
          if (last && distanceKm(last, p) < 0.005) return cur; // ignore jitter under 5 m
          return [...cur, p];
        });
      },
      (e) => {
        setError(e.message);
        stop();
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
  }

  // Demo mode: a fake walk along a curved path, so you can present without leaving your seat
  function startDemo() {
    reset();
    setSimulated(true);
    setRunning(true);
    let step = 0;
    const t0 = Date.now();
    simRef.current = setInterval(() => {
      step += 1;
      const lat = START[0] + step * 0.00009;
      const lon = START[1] + step * 0.00009 + Math.sin(step / 6) * 0.0004;
      // each tick stands for 10 s of walking, about 14 m, so the speed looks like a real walk
      setPoints((cur) => [...cur, { lat, lon, t: t0 + step * 10000 }]);
    }, 700);
  }

  function stop() {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    clearInterval(simRef.current);
    simRef.current = null;
    setRunning(false);
  }

  useEffect(() => stop, []);

  async function save() {
    if (!onSave) return;
    setSaving(true);
    setError("");
    try {
      await onSave({
        category: "Transportation",
        mode: mode.id,
        km: Number(stats.km.toFixed(3)),
        minutes: Number(stats.minutes.toFixed(1)),
        emissions: Number(co2.toFixed(3)),
        source: simulated ? "demo" : "gps",
      });
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message || "Unable to save this trip.");
    } finally {
      setSaving(false);
    }
  }

  const path = points.map((p) => [p.lat, p.lon]);
  const last = points[points.length - 1];

  return (
    <section className="eco-card">
      <header className="eco-head">
        <div>
          <span className="eco-kicker">LIVE TRIP</span>
          <h2>Trip tracker</h2>
        </div>
        {running && <span className="eco-live"><i /> Tracking</span>}
      </header>

      <div className="eco-map">
        <MapContainer center={START} zoom={15} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {path.length > 1 && <Polyline positions={path} pathOptions={{ color: "#1f6b4a", weight: 6, opacity: 0.9 }} />}
          {path[0] && <CircleMarker center={path[0]} radius={8} pathOptions={{ color: "#fff", fillColor: "#3d7ea6", fillOpacity: 1, weight: 3 }} />}
          {last && (
            <>
              <CircleMarker center={[last.lat, last.lon]} radius={16} pathOptions={{ color: "#1f6b4a", fillColor: "#1f6b4a", fillOpacity: 0.18, weight: 0 }} />
              <CircleMarker center={[last.lat, last.lon]} radius={8} pathOptions={{ color: "#fff", fillColor: "#1f6b4a", fillOpacity: 1, weight: 3 }} />
            </>
          )}
          <Follow point={last} />
        </MapContainer>
      </div>

      <div className="eco-stats">
        <div><span>Distance</span><b>{shownKm.toFixed(2)} km</b></div>
        <div><span>Speed now</span><b>{stats.now.toFixed(1)} km/h</b></div>
        <div><span>Time</span><b>{Math.floor(stats.minutes)} min</b></div>
        <div className="hot"><span>Emissions</span><b>{shownCo2.toFixed(2)} kg CO₂e</b></div>
      </div>

      {stats.km > 0.02 && (
        <div className="eco-saved">
          <span>{mode.icon}</span>
          <p>
            {savedCo2 > 0
              ? <>You saved about <b>{shownSaved.toFixed(2)} kg CO₂e</b> compared with driving this trip.</>
              : <>This trip matches an average car journey. Try a greener mode next time.</>}
          </p>
        </div>
      )}

      <div className="eco-modes" role="radiogroup" aria-label="Travel mode">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode.id === m.id}
            className={mode.id === m.id ? "on" : ""}
            onClick={() => setModeId(m.id)}
          >
            {m.icon} {m.label}{guessed.id === m.id && stats.km > 0.02 ? " ·guess" : ""}
          </button>
        ))}
      </div>

      {error && <p className="eco-error" role="alert">{error}</p>}

      <div className="eco-actions">
        {!running ? (
          <>
            <button type="button" className="eco-primary" onClick={startReal}>Start GPS trip</button>
            <button type="button" className="eco-ghost" onClick={startDemo}>Run demo walk</button>
          </>
        ) : (
          <button type="button" className="eco-primary" onClick={stop}>Stop trip</button>
        )}
        {!running && stats.km > 0.02 && (
          <button type="button" className="eco-primary" disabled={saved || saving} onClick={save}>
            {saved ? "Saved ✓" : saving ? "Saving..." : "Confirm and save trip"}
          </button>
        )}
      </div>
    </section>
  );
}