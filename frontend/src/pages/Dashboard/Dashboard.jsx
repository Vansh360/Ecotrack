import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  BarChart3,
  Car,
  Droplets,
  Leaf,
  Recycle,
  Target,
  Utensils,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useNavigate } from "react-router-dom";
import { getActivities } from "../../services/activityService";


// ==========================================
// CATEGORY ICONS
// ==========================================

const categoryIcons = {
  TRANSPORTATION: Car,
  ELECTRICITY: Zap,
  FOOD: Utensils,
  WASTE: Recycle,
  WATER: Droplets,
};


// ==========================================
// CATEGORY NAMES
// ==========================================

const categoryNames = {
  TRANSPORTATION: "Transportation",
  ELECTRICITY: "Electricity",
  FOOD: "Food",
  WASTE: "Waste",
  WATER: "Water",
};


// ==========================================
// CATEGORY ICON HELPER
// ==========================================

function getCategoryIcon(category) {
  const normalized = String(
    category || ""
  )
    .trim()
    .toUpperCase();

  return categoryIcons[normalized] || Leaf;
}


// ==========================================
// DASHBOARD
// ==========================================

export default function Dashboard() {

  const navigate = useNavigate();

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


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

      const result =
        await getActivities();

      console.log(
        "Dashboard activities:",
        result
      );

      setActivities(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (err) {

      console.error(
        "Dashboard activity error:",
        err
      );

      if (
        err?.status === 401 ||
        err?.status === 403
      ) {

        setError(
          "Your session has expired. Please login again."
        );

      } else {

        setError(
          err.message ||
          "Unable to load activities."
        );
      }

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // TOTAL EMISSION
  // ==========================================

  const totalEmission =
    useMemo(() => {

      return activities.reduce(
        (total, activity) =>
          total +
          Number(
            activity.emission || 0
          ),
        0
      );

    }, [activities]);


  // ==========================================
  // CATEGORY BREAKDOWN
  // ==========================================

  const categoryBreakdown =
    useMemo(() => {

      const result = {};

      activities.forEach(
        (activity) => {

          const category =
            String(
              activity.category ||
              "OTHER"
            )
              .trim()
              .toUpperCase();

          const emission =
            Number(
              activity.emission || 0
            );

          result[category] =
            (result[category] || 0) +
            emission;
        }
      );

      const total =
        Object.values(result).reduce(
          (sum, value) =>
            sum + value,
          0
        );

      return Object.entries(result)
        .map(
          ([category, emission]) => ({
            category,
            emission,
            percentage: total
              ? Math.round(
                  (emission / total) *
                    100
                )
              : 0,
          })
        );

    }, [activities]);


  // ==========================================
  // MONTHLY EMISSIONS
  // ==========================================

  const monthlyEmissions =
    useMemo(() => {

      const result = {};

      activities.forEach(
        (activity) => {

          const date =
            activity.activityDate ||
            activity.date ||
            activity.createdAt;

          if (!date) {
            return;
          }

          const parsed =
            new Date(date);

          if (
            Number.isNaN(
              parsed.getTime()
            )
          ) {
            return;
          }

          const month =
            parsed.toLocaleDateString(
              "en-US",
              {
                month: "short",
                year: "numeric",
              }
            );

          result[month] =
            (result[month] || 0) +
            Number(
              activity.emission || 0
            );
        }
      );

      return Object.entries(result)
        .map(
          ([month, emission]) => ({
            month,
            emission: Number(
              emission.toFixed(2)
            ),
          })
        );

    }, [activities]);


  // ==========================================
  // SCORE
  // ==========================================

  const sustainabilityScore =
  activities.length === 0
    ? 100
    : Math.max(
        0,
        Math.min(
          100,
          Math.round(
            100 - totalEmission * 2
          )
        )
      );
    


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="dashboard-loading">
        Loading your EcoTrack data...
      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div className="dashboard-error">

        <h2>
          Unable to load dashboard
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={loadActivities}
        >
          Try Again
        </button>

      </div>
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="dashboard-page">


      {/* HEADER */}

      <div className="dashboard-heading">

        <div>

          <span className="page-eyebrow">
            OVERVIEW
          </span>

          <h1>
            Sustainability Dashboard
          </h1>

          <p>
            Track your environmental impact
            and improve your sustainability.
          </p>

        </div>


        <button
          className="add-activity-button"
          onClick={() =>
            navigate("/activity/add")
          }
        >
          + Add Activity
        </button>


        <div className="dashboard-date">

          <span>
            Current Month
          </span>

          <strong>
            {new Date().toLocaleDateString(
              "en-IN",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </strong>

        </div>

      </div>


      {/* METRICS */}

      <div className="dashboard-metrics">

        <MetricCard
          icon={<Leaf size={19} />}
          title="Carbon Footprint"
          value={totalEmission.toFixed(2)}
          unit="kg CO₂e"
          description="This month"
        />


        <MetricCard
          icon={<Target size={19} />}
          title="Sustainability Score"
          value={sustainabilityScore}
          unit="/100"
          description="Current performance"
        />


        <MetricCard
          icon={<Activity size={19} />}
          title="Total Activities"
          value={activities.length}
          unit="records"
          description="Recorded activities"
        />


        <MetricCard
          icon={<Target size={19} />}
          title="CO₂ Reduced"
          value="0.00"
          unit="kg"
          description="Compared with last month"
        />

      </div>


      {/* EMISSIONS BY CATEGORY */}

      <div className="dashboard-chart-grid">


        {/* LINE CHART */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Carbon Emissions
              </h2>

              <p>
                Monthly CO₂e emissions
              </p>

            </div>

          </div>


          <div className="chart-container">

            {monthlyEmissions.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={
                    monthlyEmissions
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value} kg CO₂e`,
                      "Emission",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="emission"
                    stroke="#1f7a4d"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div className="empty-chart">

                <BarChart3 size={32} />

                <span>
                  No activity data yet
                </span>

              </div>

            )}

          </div>

        </div>


        {/* PIE CHART */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Emission Sources
              </h2>

              <p>
                Where your emissions come from
              </p>

            </div>

          </div>


          <div className="pie-chart-container">

            {categoryBreakdown.some(
              (item) =>
                item.emission > 0
            ) ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={categoryBreakdown.filter(
                      (item) =>
                        item.emission > 0
                    )}
                    dataKey="emission"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                  >

                    {categoryBreakdown
                      .filter(
                        (item) =>
                          item.emission > 0
                      )
                      .map(
                        (
                          item,
                          index
                        ) => (

                          <Cell
                            key={
                              item.category
                            }
                            fill={
                              [
                                "#1f7a4d",
                                "#4c956c",
                                "#74b49b",
                                "#a8d5ba",
                                "#d7eadf",
                              ][
                                index % 5
                              ]
                            }
                          />

                        )
                      )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="empty-chart">

                <BarChart3
                  size={32}
                />

                <span>
                  No activity data yet
                </span>

              </div>

            )}

          </div>


          {/* CATEGORY LIST */}

          <div className="category-list">

            {categoryBreakdown.map(
              (item) => {

                const Icon =
                  getCategoryIcon(
                    item.category
                  );

                return (

                  <div
                    className="category-row"
                    key={
                      item.category
                    }
                  >

                    <div className="category-name">

                      <Icon size={15} />

                      <span>
                        {
                          categoryNames[
                            item.category
                          ] ||
                          item.category
                        }
                      </span>

                    </div>


                    <div>

                      <strong>
                        {item.emission.toFixed(
                          2
                        )} kg
                      </strong>

                      <span>
                        {" "}
                        (
                        {
                          item.percentage
                        }%)
                      </span>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>

      </div>


      {/* CATEGORY CARDS */}

      <div className="dashboard-section-title">

        <div>

          <span className="page-eyebrow">
            TRACKING
          </span>

          <h2>
            This Month by Category
          </h2>

        </div>

      </div>


      <div className="category-cards">

        {categoryBreakdown.map(
          (item) => {

            const Icon =
              getCategoryIcon(
                item.category
              );

            return (

              <div
                className="category-card"
                key={item.category}
              >

                <div className="category-card-icon">

                  <Icon size={18} />

                </div>

                <span>
                  {
                    categoryNames[
                      item.category
                    ] ||
                    item.category
                  }
                </span>

                <strong>
                  {item.emission.toFixed(
                    2
                  )} kg
                </strong>

                <small>
                  {item.percentage}% of
                  total emissions
                </small>

              </div>

            );

          }
        )}

      </div>


      {/* RECENT ACTIVITIES */}

      {activities.length > 0 && (

        <>

          <div className="dashboard-section-title">

            <div>

              <span className="page-eyebrow">
                ACTIVITY
              </span>

              <h2>
                Recent Activities
              </h2>

            </div>

          </div>


          <div className="activity-list">

            {activities.map(
              (activity) => {

                const Icon =
                  getCategoryIcon(
                    activity.category
                  );

                return (

                  <div
                    className="activity-row"
                    key={activity.id}
                  >

                    <div className="activity-icon">

                      <Icon size={20} />

                    </div>


                    <div className="activity-info">

                      <strong>
                        {
                          activity.activityType ||
                          activity.category
                        }
                      </strong>

                      <span>

                        {
                          categoryNames[
                            String(
                              activity.category ||
                              ""
                            ).toUpperCase()
                          ] ||
                          activity.category
                        }

                        {" • "}

                        {activity.quantity}

                        {" "}

                        {activity.unit}

                      </span>

                    </div>


                    <div className="activity-emission">

                      <strong>

                        {Number(
                          activity.emission ||
                          0
                        ).toFixed(2)}

                        {" "}kg

                      </strong>

                      <span>
                        CO₂e
                      </span>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </>

      )}


      {/* EMPTY */}

      {activities.length === 0 && (

        <div className="dashboard-empty">

          <Leaf size={32} />

          <h3>
            Start tracking your footprint
          </h3>

          <p>
            Add transportation, electricity,
            food, waste or water activities
            to see your real carbon footprint.
          </p>

        </div>

      )}

    </div>
  );
}


// ==========================================
// METRIC CARD
// ==========================================

function MetricCard({
  icon,
  title,
  value,
  unit,
  description,
}) {

  return (

    <div className="metric-card">

      <div className="metric-icon">
        {icon}
      </div>

      <span className="metric-title">
        {title}
      </span>

      <div className="metric-value">

        <strong>
          {value}
        </strong>

        <span>
          {unit}
        </span>

      </div>

      <small>
        {description}
      </small>

    </div>

  );
}



