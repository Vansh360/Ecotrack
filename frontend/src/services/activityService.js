const API_URL = "http://localhost:8080/api";

// ==========================================
// GET ACTIVITIES
// ==========================================

export async function getActivities() {
  const token = localStorage.getItem("token");

  if (!token) {
    const error = new Error("NO_TOKEN");
    error.status = 401;
    throw error;
  }

  const response = await fetch(
    `${API_URL}/activities`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      `Unable to load activities: ${response.status}`
    );

    error.status = response.status;

    throw error;
  }

  const data = await response.json();

  console.log("Activities received:", data);

  return Array.isArray(data) ? data : [];
}


// ==========================================
// CREATE ACTIVITY
// ==========================================

export async function createActivity(activity) {
  const token = localStorage.getItem("token");

  if (!token) {
    const error = new Error("NO_TOKEN");
    error.status = 401;
    throw error;
  }

  const response = await fetch(
    `${API_URL}/activities`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(activity),
    }
  );

  if (!response.ok) {
    let message = "Failed to create activity.";

    try {
      const body = await response.json();

      message =
        body.message ||
        body.error ||
        message;
    } catch {
      // Ignore JSON parsing error
    }

    const error = new Error(message);

    error.status = response.status;

    throw error;
  }

  return await response.json();
}


// ==========================================
// UPDATE ACTIVITY
// ==========================================

export async function updateActivity(
  id,
  updatedData
) {
  const token = localStorage.getItem("token");

  if (!token) {
    const error = new Error("NO_TOKEN");
    error.status = 401;
    throw error;
  }

  const response = await fetch(
    `${API_URL}/activities/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    let message = "Failed to update activity.";

    try {
      const body = await response.json();

      message =
        body.message ||
        body.error ||
        message;
    } catch {
      // Ignore JSON parsing error
    }

    const error = new Error(message);

    error.status = response.status;

    throw error;
  }

  return await response.json();
}


// ==========================================
// DELETE ACTIVITY
// ==========================================

export async function deleteActivity(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    const error = new Error("NO_TOKEN");
    error.status = 401;
    throw error;
  }

  const response = await fetch(
    `${API_URL}/activities/${id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let message = "Failed to delete activity.";

    try {
      const body = await response.json();

      message =
        body.message ||
        body.error ||
        message;
    } catch {
      // Ignore JSON parsing error
    }

    const error = new Error(message);

    error.status = response.status;

    throw error;
  }

  // DELETE may return 204 No Content
  if (response.status === 204) {
    return true;
  }

  try {
    return await response.json();
  } catch {
    return true;
  }
}