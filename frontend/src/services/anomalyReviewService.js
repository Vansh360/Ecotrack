const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");

const REVIEWS_URL = `${API_BASE_URL}/api/anomaly-reviews`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in again to save anomaly reviews.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message =
        data.message ||
        data.error ||
        (data.errors && Object.values(data.errors).join(" ")) ||
        message;
    } catch {
      // Keep the fallback message if the response isn't JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getAnomalyReviews() {
  const response = await fetch(REVIEWS_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const reviews = await handleResponse(response);

  if (!Array.isArray(reviews)) {
    throw new Error("The server returned an invalid anomaly review list.");
  }

  return reviews;
}

export async function saveAnomalyReview(
  activityId,
  status,
  note = ""
) {
  if (!activityId) {
    throw new Error("An activity ID is required.");
  }

  const allowedStatuses = [
    "VERIFIED",
    "CORRECTED",
    "NOT_AN_ISSUE",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid anomaly review status.");
  }

  const response = await fetch(
    `${REVIEWS_URL}/${encodeURIComponent(activityId)}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
        note: String(note || "").trim(),
      }),
    }
  );

  return handleResponse(response);
}