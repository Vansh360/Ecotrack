import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
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

import useDashboard from "../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getActivities } from "../../services/activityService";

export default function Dashboard() {

  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activityError, setActivityError] = useState("");

  const loadActivities = async () => {
    try {
      setLoadingActivities(true);
      setActivityError("");

      const result = await getActivities();

      console.log("Activities received:", result);

      setActivities(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Activity loading error:", error);
      setActivityError(error.message);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const totalEmission = useMemo(() => {
    return activities.reduce(
      (total, activity) =>
        total + Number(activity.emission || 0),
      0
    );
  }, [activities]);

  const categoryEmissions = useMemo(() => {
    const result = {};

    activities.forEach((activity) => {
      const category = activity.category || "Other";

      result[category] =
        (result[category] || 0) + Number(activity.emission || 0);
    });

    return result;
  }, [activities]);

  const { data, loading, error } = useDashboard();
  const currentEmission = totalEmission;
  const co2Reduced = data?.co2Reduced ?? 0;
  const sustainabilityScore = data?.sustainabilityScore ?? 0;
  const goalProgress = data?.goalProgress ?? 0;
  const monthlyEmissions = data?.monthlyEmissions ?? [];
  const categoryBreakdown = Object.entries(categoryEmissions).map(
    ([category, emission]) => ({ category, emission, percentage: 0 })
  );
  const totalCategoryEmission = categoryBreakdown.reduce(
    (total, item) => total + item.emission,
    0
  );
  const normalizedCategoryBreakdown = categoryBreakdown.map((item) => ({
    ...item,
    percentage: totalCategoryEmission
      ? Math.round((item.emission / totalCategoryEmission) * 100)
      : 0,
  }));
  const displayCategoryBreakdown = normalizedCategoryBreakdown;
  const activityCount = activities.length;
  const co2Change = { direction: "same", percentage: 0 };


  const categoryIcons = {
    Transportation: Car,
    Electricity: Zap,
    Food: Utensils,
    Waste: Recycle,
    Water: Droplets,
  };


  return (
    <div className="dashboard-page">

      {/* ===================================
          HEADER
      =================================== */}

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

          {(loading || loadingActivities) && <p>Loading dashboard data...</p>}
          {error && <p>{error}</p>}
          {activityError && <p>{activityError}</p>}

        </div>

        <button
          className="add-activity-button"
          onClick={() => navigate("/activity/add")}
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


      {/* ===================================
          MAIN METRIC CARDS
      =================================== */}

      <div className="dashboard-metrics">


        {/* CARBON FOOTPRINT */}

        <MetricCard
          icon={<Leaf size={19} />}
          title="Carbon Footprint"
          value={currentEmission.toFixed(2)}
          unit="kg CO₂e"
          description="This month"
        />


        {/* SUSTAINABILITY SCORE */}

        <MetricCard
          icon={<Target size={19} />}
          title="Sustainability Score"
          value={sustainabilityScore}
          unit="/100"
          description="Current performance"
        />


        {/* CO2 REDUCED */}

        <MetricCard
          icon={<ArrowDownRight size={19} />}
          title="CO₂ Reduced"
          value={co2Reduced.toFixed(2)}
          unit="kg"
          description={
            co2Change.direction ===
            "down"
              ? `${co2Change.percentage}% lower than last month`
              : "Compared with last month"
          }
        />


        {/* GOAL */}

        <MetricCard
          icon={<Target size={19} />}
          title="Current Goal"
          value={goalProgress}
          unit="%"
          description="Goal progress"
        />

      </div>


      {/* ===================================
          CHANGE INDICATOR
      =================================== */}

      {activityCount > 0 && (
        <div
          className={`dashboard-change ${
            co2Change.direction
          }`}
        >

          {co2Change.direction ===
            "down" ? (
            <ArrowDownRight
              size={17}
            />
          ) : co2Change.direction ===
            "up" ? (
            <ArrowUpRight
              size={17}
            />
          ) : (
            <Activity
              size={17}
            />
          )}


          <span>

            {co2Change.direction ===
              "down"
              ? `Your emissions are ${co2Change.percentage}% lower than last month.`
              : co2Change.direction ===
                "up"
              ? `Your emissions are ${co2Change.percentage}% higher than last month.`
              : "No previous-month comparison available yet."}

          </span>

        </div>
      )}


      {/* ===================================
          CHART SECTION
      =================================== */}

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

          </div>

        </div>


        {/* CATEGORY PIE CHART */}

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

            {displayCategoryBreakdown.some(
              (item) =>
                item.emission > 0
            ) ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={
                      displayCategoryBreakdown.filter(
                        (item) =>
                          item.emission >
                          0
                      )
                    }
                    dataKey="emission"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                  >

                    {displayCategoryBreakdown
                      .filter(
                        (item) =>
                          item.emission >
                          0
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
                                index %
                                  5
                              ]
                            }
                          />

                        )
                      )}

                  </Pie>

                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      `${value} kg`,
                      "CO₂e",
                    ]}
                  />

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

            {displayCategoryBreakdown.map(
              (item) => {

                const Icon =
                  categoryIcons[
                    item.category
                  ];

                return (
                  <div
                    className="category-row"
                    key={
                      item.category
                    }
                  >

                    <div className="category-name">

                      <Icon
                        size={15}
                      />

                      <span>
                        {
                          item.category
                        }
                      </span>

                    </div>


                    <div>

                      <strong>
                        {
                          item.emission.toFixed(
                            2
                          )
                        } kg
                      </strong>

                      <span>
                        {" "}
                        (
                        {
                          item.percentage
                        }
                        %)
                      </span>

                    </div>

                  </div>
                );

              }
            )}

          </div>

        </div>

      </div>


      {/* ===================================
          CATEGORY CARDS
      =================================== */}

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

        {displayCategoryBreakdown.map(
          (item) => {

            const Icon =
              categoryIcons[
                item.category
              ];

            return (

              <div
                className="category-card"
                key={
                  item.category
                }
              >

                <div className="category-card-icon">

                  <Icon size={18} />

                </div>

                <span>
                  {item.category}
                </span>

                <strong>
                  {
                    item.emission.toFixed(
                      2
                    )
                  } kg
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


      {/* ===================================
          RECENT ACTIVITIES
      =================================== */}

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
                  categoryIcons[
                    activity.category
                  ] || Leaf;

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
                        {activity.activityType ||
                          activity.category}
                      </strong>

                      <span>
                        {activity.category}
                        {" • "}
                        {activity.quantity}
                        {" "}
                        {activity.unit}
                      </span>

                    </div>


                    <div className="activity-emission">

                      <strong>
                        {Number(
                          activity.emission || 0
                        ).toFixed(2)}
                        {" "}
                        kg
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


      {/* ===================================
          EMPTY STATE
      =================================== */}

      {!loadingActivities && activities.length === 0 && (

        <div className="dashboard-empty">

          <Leaf size={32} />

          <h3>
            Start tracking your footprint
          </h3>

          <p>
            Add transportation,
            electricity, food, waste or
            water activities to see your
            real carbon footprint.
          </p>

        </div>

      )}

    </div>
  );
}


/* =========================================
   METRIC CARD
========================================= */

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