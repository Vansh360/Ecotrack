import { useCallback, useEffect, useState } from "react";

import { getDashboardData } from "../services/dashboardService";

export default function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const result = await getDashboardData();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(loadDashboard, 0);

    return () => window.clearTimeout(initialLoad);
  }, [loadDashboard]);

  useEffect(() => {
    window.addEventListener("ecotrack:activity-saved", loadDashboard);

    return () => {
      window.removeEventListener("ecotrack:activity-saved", loadDashboard);
    };
  }, [loadDashboard]);

  return { data, loading, error, refresh: loadDashboard };
}