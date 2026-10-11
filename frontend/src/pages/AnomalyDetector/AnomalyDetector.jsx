
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Activity,
} from "lucide-react";

import { useActivities } from "../../context/ActivityContext";
import { detectCarbonAnomalies } from "../../utils/anomalyDetector";
import {
  getAnomalyReviews,
  saveAnomalyReview,
} from "../../utils/anomalyReviewStorage";

export default function AnomalyDetector() {
  const {
    activities = [],
    loading,
    error,
    refreshActivities,
  } = useActivities();

  const findings = useMemo(
    () => detectCarbonAnomalies(activities),
    [activities]
  );

  const [reviews, setReviews] = useState({});
  const [reviewNotes, setReviewNotes] = useState({});

  useEffect(() => {
    setReviews(getAnomalyReviews());
  }, []);

  const handleReview = (activityId, status) => {
    try {
      const review = saveAnomalyReview(activityId, {
        status,
        note: reviewNotes[String(activityId)] || "",
      });

      setReviews((previous) => ({
        ...previous,
        [String(activityId)]: review,
      }));
    } catch (err) {
      window.alert(err.message || "Unable to save review.");
    }
  };

  const pendingCount = findings.filter(
    (finding) => !reviews[String(finding.id)]
  ).length;

  const reviewedCount = findings.length - pendingCount;

  const highCount = findings.filter(
    (item) => item.severity === "HIGH"
  ).length;

  const mediumCount = findings.filter(
    (item) => item.severity === "MEDIUM"
  ).length;

  const formatDate = (activity) => {
    const rawDate =
      activity?.activityDate ||
      activity?.date ||
      activity?.createdAt;

    if (!rawDate) return "Date unavailable";

    const date = new Date(rawDate);

    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  if (loading) {
    return (
      <div className="tracking-page">
        <div className="tracking-card">
          <RefreshCw size={22} />
          <p>Analyzing your activity history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-page">
        <div className="tracking-card">
          <h2>Unable to load activities</h2>
          <p>{String(error)}</p>
          <button
            className="calculate-button"
            onClick={refreshActivities}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-page anomaly-page">
      <header className="tracking-header">
        <div className="tracking-icon">
          <ShieldCheck size={25} />
        </div>
        <div>
          <span>CARBON INTELLIGENCE</span>
          <h1>Smart Carbon Anomaly Detector</h1>
          <p>
            Find unusual records and emission changes that may need review.
          </p>
        </div>
      </header>

      <div className="anomaly-summary">
        <article className="anomaly-summary-card">
          <Activity size={22} />
          <span>Records analyzed</span>
          <strong>{activities.length}</strong>
        </article>

        <article className="anomaly-summary-card">
          <AlertTriangle size={22} />
          <span>High-priority flags</span>
          <strong>{highCount}</strong>
        </article>

        <article className="anomaly-summary-card">
          <AlertTriangle size={22} />
          <span>Pending reviews</span>
          <strong>{pendingCount}</strong>
        </article>

        <article className="anomaly-summary-card">
          <CheckCircle2 size={22} />
          <span>Reviewed findings</span>
          <strong>{reviewedCount}</strong>
        </article>
      </div>

      <section className="anomaly-panel">
        <div className="anomaly-panel-heading">
          <div>
            <h2>Detection results</h2>
            <p>
              Flags are suggestions for review, not proof of incorrect data.
            </p>
          </div>

          <button
            type="button"
            className="anomaly-refresh"
            onClick={refreshActivities}
          >
            <RefreshCw size={15} />
            Refresh data
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="anomaly-empty">
            <Activity size={32} />
            <h3>No activity records yet</h3>
            <p>
              Add activities to begin checking your carbon data.
            </p>
          </div>
        ) : findings.length === 0 ? (
          <div className="anomaly-empty">
            <CheckCircle2 size={36} />
            <h3>No anomalies detected</h3>
            <p>
              No invalid quantities, emissions or statistical outliers were
              found using the current detection rules.
            </p>
          </div>
        ) : (
          <div className="anomaly-list">
            {findings.map((finding, index) => {
              const activity = finding.activity;
              const review = reviews[String(finding.id)];
              const statusLabels = {
                VERIFIED: "Verified",
                CORRECTED: "Corrected",
                NOT_AN_ISSUE: "Not an issue",
              };

              return (
                <article
                  className="anomaly-item"
                  key={`${finding.id}-${finding.issue}-${index}`}
                >
                  <div className="anomaly-item-top">
                    <div>
                      <span
                        className={`anomaly-badge ${
                          finding.severity === "HIGH"
                            ? "anomaly-high"
                            : "anomaly-medium"
                        }`}
                      >
                        {finding.severity} PRIORITY
                      </span>
                      <h3>{finding.issue}</h3>
                    </div>

                    <strong>
                      {Number(activity?.emission || 0).toFixed(2)} kg CO₂e
                    </strong>
                  </div>

                  <p className="anomaly-activity-name">
                    {activity?.category || "Unknown category"} /{" "}
                    {activity?.activityType || "Unknown activity"}
                  </p>

                  <p className="anomaly-explanation">
                    {finding.explanation}
                  </p>

                  <div className="anomaly-action">
                    <strong>Recommended check</strong>
                    <p>{finding.action}</p>
                  </div>

                  <label className="anomaly-review-label">
                    Review notes
                    <textarea
                      rows={2}
                      maxLength={500}
                      placeholder="Explain what you checked or corrected..."
                      value={
                        reviewNotes[String(finding.id)] ??
                        review?.note ??
                        ""
                      }
                      onChange={(event) =>
                        setReviewNotes((previous) => ({
                          ...previous,
                          [String(finding.id)]: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <div className="anomaly-review-actions">
                    <button
                      type="button"
                      onClick={() => handleReview(finding.id, "VERIFIED")}
                    >
                      Verified
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReview(finding.id, "CORRECTED")}
                    >
                      Corrected
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReview(finding.id, "NOT_AN_ISSUE")
                      }
                    >
                      Not an issue
                    </button>
                  </div>

                  {review && (
                    <div className="anomaly-review-status">
                      <CheckCircle2 size={17} />
                      <span>
                        <strong>{statusLabels[review.status]}</strong>
                        {" · "}
                        Reviewed{" "}
                        {new Date(review.reviewedAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <small>
                    {formatDate(activity)} · Quantity:{" "}
                    {activity?.quantity ?? "Unknown"}{" "}
                    {activity?.unit || ""}
                  </small>
                </article>
              );
            })}
          </div>
        )}

        <p className="anomaly-footnote">
          {mediumCount} medium-priority flag(s). Statistical results depend
          on the amount and quality of recorded data. This first version
          uses explainable rules and robust statistics; it is not a trained
          machine-learning model.
        </p>
      </section>
    </div>
  );
}
