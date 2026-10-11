
const STORAGE_KEY = "ecotrack-anomaly-reviews-v1";

function readReviews() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};

    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

export function getAnomalyReviews() {
  return readReviews();
}

export function saveAnomalyReview(activityId, review) {
  if (activityId === null || activityId === undefined) {
    throw new Error("Cannot save a review without an activity ID.");
  }

  const validStatuses = ["VERIFIED", "CORRECTED", "NOT_AN_ISSUE"];

  if (!validStatuses.includes(review.status)) {
    throw new Error("Please select a valid review status.");
  }

  const reviews = readReviews();

  reviews[String(activityId)] = {
    status: review.status,
    note: String(review.note || "").trim().slice(0, 500),
    reviewedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

  return reviews[String(activityId)];
}

export function deleteAnomalyReview(activityId) {
  const reviews = readReviews();
  delete reviews[String(activityId)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}
