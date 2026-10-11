import {
  Brain,
  Leaf,
  Target,
  TrendingDown,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { getActivities } from "../services/activityService";

import {
  generateRecommendations,
} from "../utils/advisorEngine";

async function fetchAdvisorData() {
  const result = await getActivities();
  const activities = Array.isArray(result)
    ? result
    : [];

  return generateRecommendations(
    activities,
    250
  );
}

function formatCategoryName(category) {
  if (!category) {
    return "None";
  }

  return String(category)
    .toLowerCase()
    .replace(/(^|\s)\S/g, (character) =>
      character.toUpperCase()
    );
}


export default function Advisor() {

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [advisorData, setAdvisorData] =
    useState(null);


  /*
  ================================================
  LOAD ACTIVITIES
  ================================================
  */

  const loadAdvisor = async () => {

    try {

      setLoading(true);
      setError("");

      const recommendations =
        await fetchAdvisorData();

      setAdvisorData(recommendations);

    } catch (err) {

      console.error(
        "Advisor error:",
        err
      );

      setError(
        err.message ||
        "Unable to generate recommendations."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    let isActive = true;

    fetchAdvisorData()
      .then((recommendations) => {
        if (isActive) {
          setAdvisorData(recommendations);
        }
      })
      .catch((err) => {
        console.error("Advisor error:", err);

        if (isActive) {
          setError(
            err.message ||
            "Unable to generate recommendations."
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);


  /*
  ================================================
  LOADING
  ================================================
  */

  if (loading) {

    return (
      <div className="dashboard-loading">

        <Brain
          size={32}
        />

        <p>
          Analyzing your sustainability
          activity...
        </p>

      </div>
    );
  }


  /*
  ================================================
  ERROR
  ================================================
  */

  if (error) {

    return (
      <div className="dashboard-error">

        <h2>
          AI Advisor unavailable
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={loadAdvisor}
        >
          Try Again
        </button>

      </div>
    );
  }


  /*
  ================================================
  PAGE
  ================================================
  */

  return (

    <div className="dashboard-page advisor-dashboard-page">

      {/* HEADER */}

      <div className="dashboard-heading">

        <div>

          <span className="page-eyebrow">
            INTELLIGENT ADVISOR
          </span>

          <h1>
            AI Sustainability Advisor
          </h1>

          <p>
            Personalized recommendations
            based on your actual activity
            history.
          </p>

        </div>


        <button
          className="add-activity-button"
          onClick={loadAdvisor}
        >

          <RefreshCw
            size={16}
          />

          Refresh Advice

        </button>

      </div>


      {/* SUMMARY */}

      {advisorData && (

        <div className="dashboard-metrics advisor-metrics">

          {/* CURRENT EMISSION */}

          <div className="dashboard-panel advisor-stat-card">

            <div className="advisor-stat-content">

              <Leaf
                size={24}
              />

              <p>
                Current Month
              </p>

              <h2>
                {
                  advisorData.currentEmission
                }{" "}
                kg CO₂e
              </h2>

            </div>

          </div>


          {/* HOTSPOT */}

          <div className="dashboard-panel advisor-stat-card">

            <div className="advisor-stat-content">

              <Target
                size={24}
              />

              <p>
                Carbon Hotspot
              </p>

              <h2>
                {
                  formatCategoryName(
                    advisorData.hotspot?.category
                  )
                }
              </h2>

              <small>
                {
                  advisorData.hotspot
                    ?.emission ||
                  0
                }{" "}
                kg CO₂e
              </small>

            </div>

          </div>


          {/* BUDGET */}

          <div className="dashboard-panel advisor-stat-card">

            <div className="advisor-stat-content">

              <TrendingDown
                size={24}
              />

              <p>
                Carbon Budget
              </p>

              <h2>
                {
                  advisorData.budgetStatus
                    ?.percentage
                }%
              </h2>

              <small>
                {
                  advisorData.budgetStatus
                    ?.remaining
                }{" "}
                kg remaining
              </small>

            </div>

          </div>


          {/* SAVING */}

          <div className="dashboard-panel advisor-stat-card">

            <div className="advisor-stat-content">

              <Lightbulb
                size={24}
              />

              <p>
                Potential Saving
              </p>

              <h2>
                {
                  advisorData
                    .totalPotentialSaving
                }{" "}
                kg
              </h2>

              <small>
                from suggested actions
              </small>

            </div>

          </div>

        </div>
      )}


      {/* ADVISOR MESSAGE */}

      {advisorData && (

        <div className="dashboard-panel advisor-insight-panel">

          <div className="advisor-insight-content">

            <Brain
              size={30}
            />

            <div>

              <h2>
                Your Personalized Insight
              </h2>

              <p>
                {advisorData.message}
              </p>

              <p>

                Your largest current
                emission source is{" "}

                <strong>
                  {
                    formatCategoryName(
                      advisorData.hotspot?.category
                    )
                  }
                </strong>

                .

              </p>

            </div>

          </div>

        </div>
      )}


      {/* RECOMMENDATIONS */}

      <div className="advisor-recommendations">

        <div className="panel-header">

          <div>

            <h2>
              Recommended Actions
            </h2>

            <p>
              Prioritized using your
              activity history.
            </p>

          </div>

        </div>


        <div className="advisor-recommendation-grid">

          {advisorData?.recommendations
            ?.map(
              (
                recommendation
              ) => (

                <div
                  key={
                    recommendation.id
                  }

                  className="dashboard-panel advisor-recommendation-card"
                >

                  {/* ICON */}

                  {/* PRIORITY */}

                  <span
                    className={`advisor-priority ${
                      recommendation.priority === "HIGH"
                        ? "advisor-priority-high"
                        : "advisor-priority-medium"
                    }`}
                  >

                    {
                      recommendation
                        .priority
                    }{" "}
                    PRIORITY

                  </span>


                  <h3 className="advisor-recommendation-title">

                    {
                      recommendation.title
                    }

                  </h3>


                  <p>
                    {
                      recommendation
                        .recommendation
                    }
                  </p>


                  {/* WHY */}

                  <div className="advisor-reason">

                    <strong>
                      Why this recommendation?
                    </strong>

                    <p>
                      {
                        recommendation
                          .reason
                      }
                    </p>

                  </div>


                  {/* SAVING */}

                  <div className="advisor-saving">

                    <span>
                      Estimated CO₂ saving
                    </span>

                    <h2>

                      {
                        recommendation
                          .estimatedSaving
                      }{" "}
                      kg CO₂e

                    </h2>

                    <small>
                      {
                        recommendation
                          .savingPeriod
                      }
                    </small>

                  </div>


                  {/* ACTION */}

                  <div className="advisor-action">

                    <strong>
                      Suggested action
                    </strong>

                    <p>
                      {
                        recommendation
                          .action
                      }
                    </p>

                  </div>

                </div>

              )
            )}

        </div>

      </div>


      {/* EMPTY STATE */}

      {advisorData?.recommendations
        ?.length === 0 && (

        <div className="dashboard-panel advisor-empty-state">

          <h3>
            🌱 Start tracking your
            activities
          </h3>

          <p>
            Add transportation,
            electricity, food, waste or
            water activities to receive
            personalized recommendations.
          </p>

        </div>

      )}

    </div>
  );
}