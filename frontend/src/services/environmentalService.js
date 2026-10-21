import api from "./api";

export async function getIndianAirQuality() {
  const response = await api.get("/environment/air-quality", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!Array.isArray(response.data)) {
    throw new Error("The server returned an invalid air-quality response.");
  }

  return response.data;
}

export async function getFireHotspots(period = "24h") {
  const response = await api.get("/environment/fire-hotspots", {
    params: { period },
    headers: {
      Accept: "application/json",
    },
  });

  if (!Array.isArray(response.data)) {
    throw new Error("The server returned an invalid fire-hotspot response.");
  }

  return response.data;
}
