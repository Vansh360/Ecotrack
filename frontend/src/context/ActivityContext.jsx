import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  getActivities,
  createActivity,
  updateActivity as updateActivityApi,
  deleteActivity as deleteActivityApi,
} from "../services/activityApi";

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================
  // LOAD ACTIVITIES FROM BACKEND
  // =========================================

  const loadActivities = useCallback(async () => {
    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getActivities();

      console.log("Activities loaded from backend:", data);

      // Make sure we always store an array
      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        console.warn("Unexpected activities response:", data);
        setActivities([]);
      }

    } catch (err) {
      console.error("Failed to load activities:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load activities."
      );

    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // =========================================
  // RELOAD AFTER LOGIN
  // =========================================

  useEffect(() => {
    const handleLogin = () => {
      console.log("Login detected. Reloading activities...");
      loadActivities();
    };

    window.addEventListener(
      "ecotrack:login",
      handleLogin
    );

    return () => {
      window.removeEventListener(
        "ecotrack:login",
        handleLogin
      );
    };
  }, [loadActivities]);

  // =========================================
  // RELOAD WHEN ACTIVITY IS SAVED
  // =========================================

  useEffect(() => {
    const handleActivitySaved = () => {
      console.log("Activity saved. Reloading activities...");
      loadActivities();
    };

    window.addEventListener(
      "ecotrack:activity-saved",
      handleActivitySaved
    );

    return () => {
      window.removeEventListener(
        "ecotrack:activity-saved",
        handleActivitySaved
      );
    };
  }, [loadActivities]);

  // =========================================
  // ADD ACTIVITY
  // =========================================

  const addActivity = async (activity) => {
    try {
      setError(null);

      const saved = await createActivity(activity);

      console.log("Activity created:", saved);

      // Immediately show it in UI
      setActivities((previous) => [
        saved,
        ...previous,
      ]);

      // Then reload from database
      await loadActivities();

      return saved;

    } catch (err) {
      console.error("Failed to save activity:", err);

      setError(
        err.response?.data?.message ||
        "Failed to save activity."
      );

      throw err;
    }
  };

  // =========================================
  // UPDATE ACTIVITY
  // =========================================

  const updateActivity = async (
    id,
    updatedData
  ) => {
    try {
      setError(null);

      const updated =
        await updateActivityApi(
          id,
          updatedData
        );

      setActivities((previous) =>
        previous.map((activity) =>
          activity.id === id
            ? updated
            : activity
        )
      );

      await loadActivities();

      return updated;

    } catch (err) {
      console.error(
        "Failed to update activity:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to update activity."
      );

      throw err;
    }
  };

  // =========================================
  // DELETE ACTIVITY
  // =========================================

  const deleteActivity = async (id) => {
    try {
      setError(null);

      await deleteActivityApi(id);

      setActivities((previous) =>
        previous.filter(
          (activity) =>
            activity.id !== id
        )
      );

      await loadActivities();

    } catch (err) {
      console.error(
        "Failed to delete activity:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to delete activity."
      );

      throw err;
    }
  };

  // =========================================
  // TOTAL EMISSION
  // =========================================

  const totalEmission =
    activities.reduce(
      (total, activity) =>
        total +
        Number(activity.emission || 0),
      0
    );

  // =========================================
  // CATEGORY EMISSION
  // =========================================

  const getCategoryEmission = (category) => {
    return activities
      .filter(
        (activity) =>
          String(activity.category)
            .toUpperCase() ===
          String(category)
            .toUpperCase()
      )
      .reduce(
        (total, activity) =>
          total +
          Number(activity.emission || 0),
        0
      );
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        loading,
        error,

        addActivity,
        updateActivity,
        deleteActivity,

        totalEmission,
        getCategoryEmission,

        refreshActivities:
          loadActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

// =========================================
// HOOK
// =========================================

export function useActivities() {
  const context =
    useContext(ActivityContext);

  if (!context) {
    throw new Error(
      "useActivities must be used inside ActivityProvider"
    );
  }

  return context;
}