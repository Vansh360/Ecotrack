import {
  BarChart3,
  Car,
  Droplets,
  Leaf,
  Recycle,
  Target,
  TrendingDown,
  Utensils,
  Zap,
} from "lucide-react";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import StatCard from "../../components/dashboard/StatCard";
import EmissionCard from "../../components/dashboard/EmissionCard";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

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

            <button className="add-activity-button">
              + Add Activity
            </button>

          </div>

          {/* STAT CARDS */}

          <div className="dashboard-stat-grid">

            <StatCard
              title="Carbon Footprint"
              value="420.8"
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
                    Your emissions over the last 6 months
                  </p>
                </div>

                <select>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>

              </div>

              <div className="chart-area">

                <div className="chart-y-labels">
                  <span>600</span>
                  <span>450</span>
                  <span>300</span>
                  <span>150</span>
                  <span>0</span>
                </div>

                <div className="fake-dashboard-chart">

                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>

                  <svg
                    viewBox="0 0 600 200"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points="0,55 100,72 200,60 300,95 400,78 500,110 600,125"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <circle
                      cx="600"
                      cy="125"
                      r="6"
                      fill="currentColor"
                    />
                  </svg>

                  <div className="chart-months">
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                  </div>

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
              value="180"
              percentage={43}
              icon={<Car size={20} />}
            />

            <EmissionCard
              title="Electricity"
              value="120"
              percentage={29}
              icon={<Zap size={20} />}
            />

            <EmissionCard
              title="Food"
              value="80"
              percentage={19}
              icon={<Utensils size={20} />}
            />

            <EmissionCard
              title="Waste"
              value="40"
              percentage={9}
              icon={<Recycle size={20} />}
            />

          </div>

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

      </div>

    </div>
  );
}