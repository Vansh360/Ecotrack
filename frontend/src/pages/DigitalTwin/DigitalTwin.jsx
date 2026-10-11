
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Brain,
  Car,
  Droplets,
  Leaf,
  LoaderCircle,
  Recycle,
  RotateCcw,
  Utensils,
  Zap,
} from "lucide-react";

import { getActivities } from "../../services/activityService";
import TransportationScenario from "./TransportationScenario";

const CATEGORIES = [
  {
    key: "TRANSPORTATION",
    label: "Transportation",
    icon: Car,
    color: "#16834b",
    description: "Reduce car journeys and choose lower-impact travel.",
  },
  {
    key: "ELECTRICITY",
    label: "Electricity",
    icon: Zap,
    color: "#ca8a04",
    description: "Use less electricity and avoid unnecessary consumption.",
  },
  {
    key: "FOOD",
    label: "Food",
    icon: Utensils,
    color: "#ea580c",
    description: "Choose lower-impact meals and reduce food waste.",
  },
  {
    key: "WASTE",
    label: "Waste",
    icon: Recycle,
    color: "#0d9488",
    description: "Prevent waste, reuse products and improve recycling.",
  },
  {
    key: "WATER",
    label: "Water",
    icon: Droplets,
    color: "#0284c7",
    description: "Reduce avoidable water use.",
  },
];

const DEFAULT_REDUCTIONS = {
  TRANSPORTATION: 20,
  ELECTRICITY: 10,
  FOOD: 10,
  WASTE: 20,
  WATER: 15,
};

const DEFAULT_BUDGET = 250;

function getDate(activity) {
  return (
    activity.activityDate ||
    activity.date ||
    activity.createdAt ||
    null
  );
}

function getCurrentMonthActivities(activities) {
  const now = new Date();

  return activities.filter((activity) => {
    const rawDate = getDate(activity);
    if (!rawDate) return false;

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return false;

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });
}

function getCategoryTotals(activities) {
  const totals = Object.fromEntries(
    CATEGORIES.map((category) => [category.key, 0])
  );

  activities.forEach((activity) => {
    const category = String(activity.category || "")
      .trim()
      .toUpperCase();

    if (Object.prototype.hasOwnProperty.call(totals, category)) {
      totals[category] += Math.max(
        0,
        Number(activity.emission || 0)
      );
    }
  });

  return totals;
}

function formatKg(value) {
  return `${Number(value || 0).toFixed(2)} kg`;
}

export default function DigitalTwin() {
  const [activities, setActivities] = useState([]);
  const [reductions, setReductions] = useState(DEFAULT_REDUCTIONS);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadActivities() {
      try {
        setLoading(true);
        setError("");

        const result = await getActivities();

        if (!cancelled) {
          setActivities(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Could not load your activities. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadActivities();

    return () => {
      cancelled = true;
    };
  }, []);

  const monthlyActivities = useMemo(
    () => getCurrentMonthActivities(activities),
    [activities]
  );

  const currentTotals = useMemo(
    () => getCategoryTotals(monthlyActivities),
    [monthlyActivities]
  );

  const currentEmission = useMemo(
    () =>
      Object.values(currentTotals).reduce(
        (total, emission) => total + emission,
        0
      ),
    [currentTotals]
  );

  const scenario = useMemo(() => {
    const categories = CATEGORIES.map((category) => {
      const current = currentTotals[category.key] || 0;
      const percentage = reductions[category.key] || 0;
      const saving = current * (percentage / 100);

      return {
        ...category,
        current,
        percentage,
        saving,
        projected: current - saving,
      };
    });

    const totalSaving = categories.reduce(
      (sum, category) => sum + category.saving,
      0
    );

    const projectedEmission = Math.max(
      currentEmission - totalSaving,
      0
    );

    const savingPercentage =
      currentEmission > 0
        ? (totalSaving / currentEmission) * 100
        : 0;

    return {
      categories,
      totalSaving,
      projectedEmission,
      savingPercentage,
      annualSaving: totalSaving * 12,
    };
  }, [currentTotals, reductions, currentEmission]);

  const budgetUsed =
    budget > 0 ? (scenario.projectedEmission / budget) * 100 : 0;

  function updateReduction(category, value) {
    setReductions((previous) => ({
      ...previous,
      [category]: Number(value),
    }));
  }

  function resetScenario() {
    setReductions(DEFAULT_REDUCTIONS);
    setBudget(DEFAULT_BUDGET);
  }

  if (loading) {
    return (
      <div className="tracking-page">
        <div className="tracking-card">
          <LoaderCircle size={24} />
          <p>Building your personal carbon twin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-page">
        <div className="tracking-card">
          <h2>Unable to load your carbon data</h2>
          <p>{error}</p>
          <button
            className="calculate-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-page digital-twin-page">
      <header className="tracking-header">
        <div className="tracking-icon">
          <Brain size={26} />
        </div>

        <div>
          <span>SIMULATE YOUR FUTURE</span>
          <h1>Personal Carbon Digital Twin</h1>
          <p>
            Explore how everyday lifestyle changes could affect your
            carbon footprint.
          </p>
        </div>
      </header>

      <section className="twin-hero">
        <div>
          <span className="twin-eyebrow">
            YOUR LIFESTYLE SIMULATION
          </span>
          <h2>What if you lived a little greener?</h2>
          <p>
            Adjust the reductions below to explore a possible future.
            Your saved activity history remains unchanged.
          </p>
        </div>
        <Leaf size={58} strokeWidth={1.4} />
      </section>

      {monthlyActivities.length === 0 && (
        <div className="twin-notice">
          <strong>No activities recorded this month.</strong>
          <p>
            Add activities in Transportation, Electricity, Food, Waste
            or Water to build a personalized simulation. Until then,
            the scenario starts at zero.
          </p>
        </div>
      )}

      <section className="twin-summary-grid">
        <article className="twin-stat">
          <span>
            <Activity size={18} /> Current monthly footprint
          </span>
          <strong>{formatKg(currentEmission)}</strong>
          <small>From this month's recorded activities</small>
        </article>

        <article className="twin-stat twin-stat-highlight">
          <span>
            <ArrowDownRight size={18} /> Potential monthly saving
          </span>
          <strong>{formatKg(scenario.totalSaving)}</strong>
          <small>
            {scenario.savingPercentage.toFixed(1)}% below your current
            footprint
          </small>
        </article>

        <article className="twin-stat">
          <span>
            <Leaf size={18} /> Simulated monthly footprint
          </span>
          <strong>{formatKg(scenario.projectedEmission)}</strong>
          <small>Estimated result if your selected changes are achieved</small>
        </article>

        <article className="twin-stat">
          <span>
            <ArrowRight size={18} /> Annualized saving
          </span>
          <strong>{formatKg(scenario.annualSaving)}</strong>
          <small>
            Illustrative estimate if the same monthly saving continued
            for 12 months
          </small>
        </article>
      </section>

      <section className="twin-layout">
        <div className="twin-controls">
          <div className="twin-section-heading">
            <div>
              <h2>Design your future lifestyle</h2>
              <p>Adjust each category from 0% to 100%.</p>
            </div>

            <button
              type="button"
              className="twin-reset-button"
              onClick={resetScenario}
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          {scenario.categories.map((category) => {
            const Icon = category.icon;

            return (
              <div className="twin-category" key={category.key}>
                <div className="twin-category-heading">
                  <div className="twin-category-icon">
                    <Icon size={20} color={category.color} />
                  </div>

                  <div className="twin-category-name">
                    <strong>{category.label}</strong>
                    <small>{category.description}</small>
                  </div>

                  <strong className="twin-percent">
                    {category.percentage}%
                  </strong>
                </div>

                <input
                  aria-label={`${category.label} emission reduction`}
                  className="twin-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={category.percentage}
                  onChange={(event) =>
                    updateReduction(category.key, event.target.value)
                  }
                  style={{ accentColor: category.color }}
                />

                <div className="twin-range-labels">
                  <span>No change</span>
                  <span>Complete reduction scenario</span>
                </div>

                <div className="twin-category-results">
                  <span>
                    Current: <strong>{formatKg(category.current)}</strong>
                  </span>
                  <span>
                    Saving:{" "}
                    <strong>{formatKg(category.saving)}</strong>
                  </span>
                  <span>
                    After:{" "}
                    <strong>{formatKg(category.projected)}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="twin-results">
          <span className="twin-eyebrow">YOUR SIMULATED FUTURE</span>
          <h2>Footprint comparison</h2>

          <div className="twin-bar-group">
            <div className="twin-bar-label">
              <span>Current</span>
              <strong>{formatKg(currentEmission)}</strong>
            </div>
            <div className="twin-bar-track">
              <div
                className="twin-bar current"
                style={{ width: currentEmission > 0 ? "100%" : "0%" }}
              />
            </div>
          </div>

          <div className="twin-bar-group">
            <div className="twin-bar-label">
              <span>Simulated</span>
              <strong>{formatKg(scenario.projectedEmission)}</strong>
            </div>
            <div className="twin-bar-track">
              <div
                className="twin-bar projected"
                style={{
                  width:
                    currentEmission > 0
                      ? `${Math.min(
                          100,
                          (scenario.projectedEmission / currentEmission) * 100
                        )}%`
                      : "0%",
                }}
              />
            </div>
          </div>

          <div className="twin-budget">
            <label htmlFor="carbon-budget">
              Monthly carbon budget (kg CO₂e)
            </label>
            <input
              id="carbon-budget"
              type="number"
              min="1"
              max="100000"
              value={budget}
              onChange={(event) => {
                const value = Number(event.target.value);
                setBudget(
                  Number.isFinite(value) && value > 0
                    ? Math.min(value, 100000)
                    : 1
                );
              }}
            />

            <div className="twin-budget-track">
              <div
                className={`twin-budget-fill ${
                  budgetUsed > 100 ? "over-budget" : ""
                }`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              />
            </div>

            <p>
              {budgetUsed > 100
                ? `The simulated footprint is ${formatKg(
                    scenario.projectedEmission - budget
                  )} above your target.`
                : `${Math.max(
                    budget - scenario.projectedEmission,
                    0
                  ).toFixed(2)} kg CO₂e remaining in your simulated budget.`}
            </p>
          </div>

          <div className="twin-insight">
            <Brain size={22} />
            <div>
              <strong>Your scenario insight</strong>
              <p>
                {currentEmission === 0
                  ? "Record activities to receive a personalized comparison."
                  : scenario.totalSaving === 0
                    ? "Your selected settings do not reduce emissions. Adjust a category to explore a different scenario."
                    : `Your selected changes could reduce estimated monthly emissions by ${formatKg(
                        scenario.totalSaving
                      )}. Transportation and other categories with the largest potential savings are good places to focus.`}
              </p>
            </div>
          </div>

          <p className="twin-disclaimer">
            This is a scenario estimate, not a guaranteed reduction.
            It assumes the selected percentage reductions are achieved
            against the recorded monthly emissions. Annualized savings
            assume similar activity and savings every month.
          </p>
        </aside>
      </section>
      <TransportationScenario />
    </div>
  );
}
