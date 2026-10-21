
import { useMemo, useState } from "react";
import { useActivities } from "../../context/ActivityContext";
import { generateEcoActions } from "../../utils/ecoActionEngine";

const STORAGE_KEY = "ecotrack-ecoaction-status-v1";

function readStatuses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "28px 20px",
    color: "var(--text-primary, #18352a)",
  },
  panel: {
    background: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #e1e9e3)",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 18px rgba(25, 70, 40, 0.05)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  button: {
    border: 0,
    borderRadius: "9px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
};

function formatKg(value) {
  return `${Number(value || 0).toFixed(2)} kg CO₂e`;
}

export default function EcoActionPlanner() {
  const context = useActivities();
  const activities = Array.isArray(context?.activities)
    ? context.activities
    : [];

  const loading = Boolean(context?.loading);
  const error = context?.error;

  const [statuses, setStatuses] = useState(readStatuses);
  const [filter, setFilter] = useState("ALL");

  const result = useMemo(
    () => generateEcoActions(activities),
    [activities]
  );

  function updateStatus(id, status) {
    const updated = { ...statuses };

    if (updated[id] === status) {
      delete updated[id];
    } else {
      updated[id] = status;
    }

    setStatuses(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (storageError) {
      console.warn("Could not save action status", storageError);
    }
  }

  const visibleActions = result.recommendations
    .filter((action) => filter === "ALL" || action.category === filter)
    .sort((a, b) => {
      const aStatus = statuses[a.id] ? 1 : 0;
      const bStatus = statuses[b.id] ? 1 : 0;

      return aStatus - bStatus || b.share - a.share;
    });

  const plannedCount = Object.values(statuses).filter(
    (status) => status === "PLANNED"
  ).length;

  const completedCount = Object.values(statuses).filter(
    (status) => status === "COMPLETED"
  ).length;

  if (loading) {
    return <main style={styles.page}>Loading your activities...</main>;
  }

  if (error) {
    return (
      <main style={styles.page}>
        <h1>EcoAction Planner</h1>
        <p>
          We could not load your activity records. Please refresh your
          activities and try again.
        </p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={{ marginBottom: 24 }}>
        <p
          style={{
            color: "#26834a",
            fontWeight: 800,
            letterSpacing: 1.5,
            fontSize: 12,
          }}
        >
          ECOTRACK · PERSONAL SUSTAINABILITY
        </p>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "8px 0" }}>
          Your EcoAction Planner 🌱
        </h1>

        <p style={{ maxWidth: 760, lineHeight: 1.7, opacity: 0.8 }}>
          Turn your recorded carbon footprint into small, practical actions.
          Start with the categories that contribute most to your recorded
          emissions.
        </p>
      </header>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <p style={{ margin: 0, opacity: 0.7 }}>Recorded emissions</p>
          <h2>{formatKg(result.totalEmission)}</h2>
          <small>Across the activities currently available to EcoTrack</small>
        </div>

        <div style={styles.panel}>
          <p style={{ margin: 0, opacity: 0.7 }}>Categories found</p>
          <h2>{result.categoryCount}</h2>
          <small>Categories with recorded positive emissions</small>
        </div>

        <div style={styles.panel}>
          <p style={{ margin: 0, opacity: 0.7 }}>Actions planned</p>
          <h2>{plannedCount}</h2>
          <small>Plans saved in this browser</small>
        </div>

        <div style={styles.panel}>
          <p style={{ margin: 0, opacity: 0.7 }}>Actions completed</p>
          <h2>{completedCount}</h2>
          <small>Completion labels saved in this browser</small>
        </div>
      </section>

      <section style={{ ...styles.panel, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Your biggest emission sources</h2>

        {result.hotspots.length === 0 ? (
          <p>
            No positive emissions were found in your loaded activities yet.
            Record an activity first to receive personalized recommendations.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {result.hotspots.slice(0, 5).map((hotspot) => (
              <div key={hotspot.category}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 7,
                  }}
                >
                  <strong>{hotspot.category}</strong>
                  <span>
                    {formatKg(hotspot.emission)} · {hotspot.share.toFixed(1)}%
                  </span>
                </div>

                <div
                  style={{
                    height: 9,
                    background: "#e8efe9",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, hotspot.share)}%`,
                      background: "#2c9856",
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 28 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div>
            <h2 style={{ marginBottom: 4 }}>Recommended actions</h2>
            <p style={{ marginTop: 0, opacity: 0.75 }}>
              Start with one action you can realistically maintain.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 9,
              border: "1px solid #cbd9cf",
              background: "white",
              color: "#18352a",
            }}
          >
            <option value="ALL">All categories</option>
            {result.hotspots.map((hotspot) => (
              <option key={hotspot.category} value={hotspot.category}>
                {hotspot.category}
              </option>
            ))}
          </select>
        </div>

        {visibleActions.length === 0 ? (
          <div style={styles.panel}>
            <p>
              No recommendations are available for this filter yet. Add
              activities in transportation, electricity, food, waste or water.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {visibleActions.map((action) => {
              const status = statuses[action.id];

              return (
                <article
                  key={action.id}
                  style={{
                    ...styles.panel,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#267c46",
                      }}
                    >
                      {action.category}
                    </span>

                    {status && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          borderRadius: 99,
                          padding: "5px 8px",
                          background:
                            status === "COMPLETED" ? "#d9f6e3" : "#fff0c2",
                          color: "#244b32",
                        }}
                      >
                        {status === "COMPLETED" ? "COMPLETED" : "PLANNED"}
                      </span>
                    )}
                  </div>

                  <h3 style={{ margin: 0 }}>{action.title}</h3>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    {action.description}
                  </p>

                  <div
                    style={{
                      background: "#f0f7f1",
                      borderRadius: 10,
                      padding: 12,
                      color: "#244b32",
                    }}
                  >
                    <strong>
                      Illustrative saving: {formatKg(action.estimatedSaving)}
                    </strong>
                    <p style={{ margin: "6px 0 0", fontSize: 13 }}>
                      Assumes a {action.estimatedSavingRate}% reduction in
                      emissions for this category. This is a scenario, not a
                      guaranteed or measured saving.
                    </p>
                  </div>

                  <p style={{ fontSize: 13, margin: 0 }}>
                    <strong>Why suggested:</strong> {action.why} Your recorded
                    category share is {action.share.toFixed(1)}%.
                  </p>

                  <p style={{ fontSize: 13, margin: 0 }}>
                    <strong>Difficulty:</strong> {action.difficulty}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginTop: "auto",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => updateStatus(action.id, "PLANNED")}
                      style={{
                        ...styles.button,
                        background: "#e8f2eb",
                        color: "#205b35",
                      }}
                    >
                      {status === "PLANNED" ? "Remove plan" : "Plan this"}
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(action.id, "COMPLETED")}
                      style={{
                        ...styles.button,
                        background: "#287d49",
                        color: "white",
                      }}
                    >
                      {status === "COMPLETED" ? "Undo complete" : "Mark done"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p style={{ marginTop: 22, fontSize: 13, opacity: 0.75, lineHeight: 1.6 }}>
        Important: these recommendations are rule-based. Saving an action as
        completed does not automatically change your activity records or prove
        that emissions were reduced. EcoTrack must record later activities
        before actual changes can be evaluated.
      </p>
    </main>
  );
}
