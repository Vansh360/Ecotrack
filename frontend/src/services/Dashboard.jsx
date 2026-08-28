import { useEffect, useMemo, useState } from "react";
import { getActivities } from "../../services/activityService";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ACTIVITIES
  // ==========================================

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      setLoading(true);
      setError("");

      const result = await getActivities();

      console.log("Dashboard activities:", result);

      if (Array.isArray(result)) {
        setActivities(result);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error("Dashboard activity error:", err);

      if (err?.status === 401 || err?.status === 403) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError("Unable to load your activities.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // TOTAL EMISSION
  // ==========================================

  const totalEmission = useMemo(() => {
    return activities.reduce((total, activity) => {
      return total + Number(activity.emission || 0);
    }, 0);
  }, [activities]);

  // ==========================================
  // CATEGORY EMISSIONS
  // ==========================================

  const categoryEmissions = useMemo(() => {
    const result = {
      TRANSPORTATION: 0,
      ELECTRICITY: 0,
      FOOD: 0,
      WASTE: 0,
      WATER: 0,
    };

    activities.forEach((activity) => {
      const category = String(
        activity.category || ""
      ).toUpperCase();

      const emission = Number(
        activity.emission || 0
      );

      if (result[category] !== undefined) {
        result[category] += emission;
      }
    });

    return result;
  }, [activities]);

  // ==========================================
  // ACTIVITY COUNT
  // ==========================================

  const activityCount = activities.length;

  // ==========================================
  // SUSTAINABILITY SCORE
  // ==========================================

  const sustainabilityScore = useMemo(() => {
    if (activityCount === 0) {
      return 100;
    }

    /*
      Simple score for now.

      Later we can replace this with
      your advanced scoring algorithm.
    */

    const score =
      100 - totalEmission * 5;

    return Math.max(
      0,
      Math.min(100, Math.round(score))
    );
  }, [totalEmission, activityCount]);

  // ==========================================
  // MONTHLY EMISSIONS
  // ==========================================

  const monthlyEmissions = useMemo(() => {
    const months = {};

    activities.forEach((activity) => {
      const date =
        activity.activityDate ||
        activity.date ||
        activity.createdAt;

      if (!date) {
        return;
      }

      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return;
      }

      const month = parsedDate.toLocaleString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );

      if (!months[month]) {
        months[month] = 0;
      }

      months[month] += Number(
        activity.emission || 0
      );
    });

    return months;
  }, [activities]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontSize: "18px",
        }}
      >
        Loading your EcoTrack data...
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        <h2>Unable to load dashboard</h2>

        <p>{error}</p>

        <button
          onClick={loadActivities}
          style={{
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <p
          style={{
            color: "#198754",
            fontWeight: "700",
            letterSpacing: "1px",
            marginBottom: "5px",
          }}
        >
          ECOTRACK
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "36px",
          }}
        >
          Sustainability Dashboard
        </h1>

        <p
          style={{
            color: "#666",
            marginTop: "8px",
          }}
        >
          Monitor your carbon footprint and
          sustainability progress.
        </p>
      </div>

      {/* SUMMARY CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        {/* TOTAL EMISSION */}

        <div
          style={{
            padding: "25px",
            borderRadius: "15px",
            background: "#ffffff",
            border: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              color: "#666",
              margin: 0,
            }}
          >
            Carbon Footprint
          </p>

          <h2
            style={{
              fontSize: "30px",
              margin: "10px 0",
            }}
          >
            {totalEmission.toFixed(2)}
          </h2>

          <span>kg CO₂e</span>
        </div>

        {/* SCORE */}

        <div
          style={{
            padding: "25px",
            borderRadius: "15px",
            background: "#ffffff",
            border: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              color: "#666",
              margin: 0,
            }}
          >
            Sustainability Score
          </p>

          <h2
            style={{
              fontSize: "30px",
              margin: "10px 0",
            }}
          >
            {sustainabilityScore}
            <span
              style={{
                fontSize: "18px",
              }}
            >
              /100
            </span>
          </h2>

          <span>Current score</span>
        </div>

        {/* ACTIVITIES */}

        <div
          style={{
            padding: "25px",
            borderRadius: "15px",
            background: "#ffffff",
            border: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              color: "#666",
              margin: 0,
            }}
          >
            Total Activities
          </p>

          <h2
            style={{
              fontSize: "30px",
              margin: "10px 0",
            }}
          >
            {activityCount}
          </h2>

          <span>Recorded activities</span>
        </div>

        {/* GOAL */}

        <div
          style={{
            padding: "25px",
            borderRadius: "15px",
            background: "#ffffff",
            border: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              color: "#666",
              margin: 0,
            }}
          >
            CO₂ Reduced
          </p>

          <h2
            style={{
              fontSize: "30px",
              margin: "10px 0",
            }}
          >
            0.00
          </h2>

          <span>kg CO₂e</span>
        </div>
      </div>

      {/* CATEGORY SECTION */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e5e5",
          borderRadius: "15px",
          padding: "25px",
          marginBottom: "30px",
        }}
      >
        <h2>
          Emissions by Category
        </h2>

        {Object.entries(
          categoryEmissions
        ).map(([category, emission]) => (
          <div
            key={category}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              padding: "14px 0",
              borderBottom:
                "1px solid #eeeeee",
            }}
          >
            <span>
              {formatCategory(category)}
            </span>

            <strong>
              {emission.toFixed(2)} kg CO₂e
            </strong>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITIES */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e5e5",
          borderRadius: "15px",
          padding: "25px",
          marginBottom: "30px",
        }}
      >
        <h2>
          Recent Activities
        </h2>

        {activities.length === 0 ? (
          <p>
            No activities found. Start tracking
            your carbon footprint.
          </p>
        ) : (
          <div>
            {activities
              .slice(0, 5)
              .map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    padding: "15px 0",
                    borderBottom:
                      "1px solid #eeeeee",
                  }}
                >
                  <div>
                    <strong>
                      {formatCategory(
                        activity.category
                      )}
                    </strong>

                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "#666",
                      }}
                    >
                      {activity.activityType ||
                        "Activity"}{" "}
                      •{" "}
                      {activity.quantity}{" "}
                      {activity.unit}
                    </p>
                  </div>

                  <strong>
                    {Number(
                      activity.emission || 0
                    ).toFixed(2)}{" "}
                    kg CO₂e
                  </strong>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* MONTHLY */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e5e5",
          borderRadius: "15px",
          padding: "25px",
        }}
      >
        <h2>
          Monthly Emissions
        </h2>

        {Object.keys(
          monthlyEmissions
        ).length === 0 ? (
          <p>
            No monthly emission data available.
          </p>
        ) : (
          Object.entries(
            monthlyEmissions
          ).map(([month, emission]) => (
            <div
              key={month}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "14px 0",
                borderBottom:
                  "1px solid #eeeeee",
              }}
            >
              <span>{month}</span>

              <strong>
                {emission.toFixed(2)} kg CO₂e
              </strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// ==========================================
// FORMAT CATEGORY
// ==========================================

function formatCategory(category) {
  if (!category) {
    return "";
  }

  return category
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase()
    );
}