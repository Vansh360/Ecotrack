import axios from "axios";

const API_URL = "http://localhost:8080/api/activities";


// =====================================================
// GET ALL ACTIVITIES
// =====================================================

export const getActivities = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// =====================================================
// CREATE ACTIVITY
// =====================================================

export const createActivity = async (activity) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const payload = {
    category: activity.category,
    activityType: activity.activityType,
    quantity: Number(activity.quantity),
    unit: activity.unit,

    activityDate:
      activity.activityDate ||
      new Date().toISOString().split("T")[0],

    metadata:
      activity.metadata || null,
  };

  console.log("Creating activity:", payload);

  const response = await axios.post(
    API_URL,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


// =====================================================
// UPDATE ACTIVITY
// =====================================================

export const updateActivity = async (id, activity) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const payload = {
    category: activity.category,
    activityType: activity.activityType,
    quantity: Number(activity.quantity),
    unit: activity.unit,

    activityDate:
      activity.activityDate ||
      new Date().toISOString().split("T")[0],

    metadata:
      activity.metadata || null,
  };

  console.log(
    `Updating activity ${id}:`,
    payload
  );

  const response = await axios.put(
    `${API_URL}/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


// =====================================================
// DELETE ACTIVITY
// =====================================================

export const deleteActivity = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};