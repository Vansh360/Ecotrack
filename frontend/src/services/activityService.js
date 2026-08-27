const API_URL = "http://localhost:8080/api";

export async function getActivities() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login again.");
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
    throw new Error(
      `Unable to load activities: ${response.status}`
    );
  }

  return await response.json();
}