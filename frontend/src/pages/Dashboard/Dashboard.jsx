import {
  Activity,
  Leaf,
  TrendingDown,
  Target,
  BarChart3,
  Car,
  Zap,
  Utensils,
  Recycle,
  Droplets,
  X,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import StatCard from "../../components/dashboard/StatCard";
import EmissionCard from "../../components/dashboard/EmissionCard";
import { useActivities } from "../../context/ActivityContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showActivityModal, setShowActivityModal] = useState(false);
  const {
    activities,
    totalEmission,
    getCategoryEmission,
  } = useActivities();

  const categoryEmissions = [
    { name: "Transportation", value: getCategoryEmission("Transportation") },
    { name: "Electricity", value: getCategoryEmission("Electricity") },
    { name: "Food", value: getCategoryEmission("Food") },
    { name: "Waste", value: getCategoryEmission("Waste") },
    { name: "Water", value: getCategoryEmission("Water") },
  ];

  const transportationEmission = categoryEmissions[0].value;
  const electricityEmission = categoryEmissions[1].value;
  const foodEmission = categoryEmissions[2].value;
  const wasteEmission = categoryEmissions[3].value;

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar onAddActivity={() => setShowActivityModal(true)} />

        <main className="dashboard-content">

          {/* HEADER */}

          <div className="dashboard-header">

            <div>
              <span className="dashboard-label">
                OVERVIEW
              </span>

              <h1>
                Good evening, Vansh 🌱
              </h1>

              <p>
                Here's an overview of your environmental
                impact this month.
              </p>
            </div>

            <button
              className="add-activity-button"
              onClick={() => setShowActivityModal(true)}
            >
              <span>+</span>
              Add Activity
            </button>

          </div>

          {/* STAT CARDS */}

          <div className="dashboard-stat-grid">

            <StatCard
              title="Carbon Footprint"
              value={totalEmission.toFixed(1)}
              unit="kg"
              change="8.4%"
              positive
              icon={<Leaf size={21} />}
            />

            <StatCard
              title="Sustainability Score"
              value="78"
              unit="/100"
              change="5.2%"
              positive
              icon={<Target size={21} />}
            />

            <StatCard
              title="CO₂ Reduced"
              value="38.5"
              unit="kg"
              change="12.1%"
              positive
              icon={<TrendingDown size={21} />}
            />

            <StatCard
              title="Current Goal"
              value="62"
              unit="%"
              change="On track"
              positive
              icon={<BarChart3 size={21} />}
            />

          </div>

          {/* MAIN GRID */}

          <div className="dashboard-grid">

            {/* CHART */}

            <section className="dashboard-panel chart-panel">

              <div className="panel-header">

                <div>
                  <h3>Carbon Emissions</h3>

                  <p>
                    Your current emissions by category
                  </p>
                </div>

                <select>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>

              </div>

              <div className="chart-area">

                <div className="category-chart">
                  {categoryEmissions.map((category) => (
                    <div className="category-chart-row" key={category.name}>
                      <span>{category.name}</span>
                      <div className="category-chart-track">
                        <div
                          className="category-chart-bar"
                          style={{
                            width: `${totalEmission ? Math.max((category.value / totalEmission) * 100, category.value ? 4 : 0) : 0}%`,
                          }}
                        />
                      </div>
                      <strong>{category.value.toFixed(1)} kg</strong>
                    </div>
                  ))}
                </div>

              </div>

            </section>

            {/* SCORE */}

            <section className="dashboard-panel score-panel">

              <div className="panel-header">

                <div>
                  <h3>Sustainability Score</h3>
                  <p>Your current performance</p>
                </div>

              </div>

              <div className="big-score">

                <div className="score-circle">
                  <strong>78</strong>
                  <span>/100</span>
                </div>

              </div>

              <div className="score-status">
                <Leaf size={17} />
                <strong>Good progress!</strong>
              </div>

              <p className="score-text">
                You're doing better than 68% of
                EcoTrack users.
              </p>

            </section>

          </div>

          {/* EMISSION BREAKDOWN */}

          <div className="section-title-row">

            <div>
              <h2>Emission Breakdown</h2>
              <p>
                See where your carbon footprint comes from.
              </p>
            </div>

            <a href="#all">
              View all →
            </a>

          </div>

          <div className="emission-grid">

            <EmissionCard
              title="Transportation"
              value={transportationEmission.toFixed(1)}
              percentage={totalEmission ? Math.round((transportationEmission / totalEmission) * 100) : 0}
              icon={<Car size={20} />}
            />

            <EmissionCard
              title="Electricity"
              value={electricityEmission.toFixed(1)}
              percentage={totalEmission ? Math.round((electricityEmission / totalEmission) * 100) : 0}
              icon={<Zap size={20} />}
            />

            <EmissionCard
              title="Food"
              value={foodEmission.toFixed(1)}
              percentage={totalEmission ? Math.round((foodEmission / totalEmission) * 100) : 0}
              icon={<Utensils size={20} />}
            />

            <EmissionCard
              title="Waste"
              value={wasteEmission.toFixed(1)}
              percentage={totalEmission ? Math.round((wasteEmission / totalEmission) * 100) : 0}
              icon={<Recycle size={20} />}
            />

          </div>

          <section className="dashboard-panel recent-activities">
            <div className="panel-header">
              <div>
                <h2>Recent Activities</h2>
                <p>Your latest carbon footprint records</p>
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="empty-activities">
                <Leaf size={25} />
                <strong>No activities yet</strong>
                <p>Click &quot;Add Activity&quot; to start tracking your carbon footprint.</p>
              </div>
            ) : (
              <div className="activity-history-list">
                {activities.slice(0, 5).map((activity) => (
                  <div className="activity-history-item" key={activity.id}>
                    <div>
                      <strong>{activity.category}</strong>
                      <span>
                        {activity.details || activity.activityType} &bull; {activity.quantity} {activity.unit}
                      </span>
                    </div>
                    <strong className="activity-emission">
                      {Number(activity.emission).toFixed(2)} kg
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* BOTTOM */}

          <div className="dashboard-grid bottom-grid">

            {/* GOAL */}

            <section className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h3>Monthly Goal</h3>

                  <p>
                    Reduce emissions below 250 kg
                  </p>
                </div>

                <Target size={22} />

              </div>

              <div className="goal-values">

                <strong>
                  420
                  <small> kg</small>
                </strong>

                <span>
                  Target: 250 kg
                </span>

              </div>

              <div className="goal-progress">

                <div></div>

              </div>

              <div className="goal-footer">

                <span>
                  62% progress
                </span>

                <span>
                  170 kg remaining
                </span>

              </div>

            </section>

            {/* AI */}

            <section className="dashboard-panel ai-dashboard-card">

              <div className="ai-small-icon">
                ✨
              </div>

              <span className="dashboard-label">
                AI ADVISOR
              </span>

              <h3>
                One simple change can make a difference.
              </h3>

              <p>
                Try replacing two car trips per week
                with public transportation.
              </p>

              <strong>
                Potential saving: 28 kg CO₂/month
              </strong>

              <button>
                View Recommendation →
              </button>

            </section>

          </div>

        </main>

        {showActivityModal && (
          <div
            className="activity-modal-overlay"
            onClick={() => setShowActivityModal(false)}
          >
            <div
              className="activity-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="activity-modal-header">
                <div>
                  <span className="modal-label">ECOTRACK</span>
                  <h2>Add Activity</h2>
                  <p>Select what you want to track today.</p>
                </div>

                <button
                  className="modal-close"
                  onClick={() => setShowActivityModal(false)}
                  aria-label="Close activity modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="activity-options">
                <button
                  className="activity-option"
                  onClick={() => {
                    setShowActivityModal(false);
                    navigate("/tracking/transportation");
                  }}
                >
                  <div className="activity-option-icon transportation-icon">
                    <Car size={22} />
                  </div>
                  <div>
                    <strong>Transportation</strong>
                    <span>Car, bike, bus, train or flight</span>
                  </div>
                  <span className="activity-arrow">→</span>
                </button>

                <button
                  className="activity-option"
                  onClick={() => {
                    setShowActivityModal(false);
                    navigate("/tracking/electricity");
                  }}
                >
                  <div className="activity-option-icon electricity-icon">
                    <Zap size={22} />
                  </div>
                  <div>
                    <strong>Electricity</strong>
                    <span>Track your electricity consumption</span>
                  </div>
                  <span className="activity-arrow">→</span>
                </button>

                <button
                  className="activity-option"
                  onClick={() => {
                    setShowActivityModal(false);
                    navigate("/tracking/food");
                  }}
                >
                  <div className="activity-option-icon food-icon">
                    <Utensils size={22} />
                  </div>
                  <div>
                    <strong>Food</strong>
                    <span>Track your food consumption</span>
                  </div>
                  <span className="activity-arrow">→</span>
                </button>

                <button
                  className="activity-option"
                  onClick={() => {
                    setShowActivityModal(false);
                    navigate("/tracking/waste");
                  }}
                >
                  <div className="activity-option-icon waste-icon">
                    <Recycle size={22} />
                  </div>
                  <div>
                    <strong>Waste</strong>
                    <span>Plastic, paper and food waste</span>
                  </div>
                  <span className="activity-arrow">→</span>
                </button>

                <button
                  className="activity-option"
                  onClick={() => {
                    setShowActivityModal(false);
                    navigate("/tracking/water");
                  }}
                >
                  <div className="activity-option-icon water-icon">
                    <Droplets size={22} />
                  </div>
                  <div>
                    <strong>Water</strong>
                    <span>Track your daily water usage</span>
                  </div>
                  <span className="activity-arrow">→</span>
                </button>
              </div>

              <button
                className="activity-cancel"
                onClick={() => setShowActivityModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}