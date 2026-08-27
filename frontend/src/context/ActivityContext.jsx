import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getActivities,
  createActivity,
  updateActivity as updateActivityApi,
  deleteActivity as deleteActivityApi,
} from "../services/activityApi";


const ActivityContext =
  createContext();


export function ActivityProvider({
  children,
}) {

  const [
    activities,
    setActivities,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(null);


  /* ===============================
     LOAD FROM BACKEND
  =============================== */

  const loadActivities =
    async () => {

      try {

        setLoading(true);

        setError(null);

        const data =
          await getActivities();

        setActivities(data);

      } catch (err) {

        console.error(err);

        setError(
          "Unable to connect to EcoTrack backend."
        );

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    loadActivities();

  }, []);


  /* ===============================
     ADD
  =============================== */

  const addActivity =
    async (activity) => {

      try {

        const saved =
          await createActivity(
            activity
          );

        setActivities(
          (previous) => [
            saved,
            ...previous,
          ]
        );

        window.dispatchEvent(
          new CustomEvent("ecotrack:activity-saved")
        );

        return saved;

      } catch (err) {

        console.error(err);

        setError(
          "Failed to save activity."
        );

        throw err;
      }
    };


  /* ===============================
     UPDATE
  =============================== */

  const updateActivity =
    async (
      id,
      updatedData
    ) => {

      try {

        const updated =
          await updateActivityApi(
            id,
            updatedData
          );

        setActivities(
          (previous) =>
            previous.map(
              (activity) =>
                activity.id === id
                  ? updated
                  : activity
            )
        );

        window.dispatchEvent(
          new CustomEvent("ecotrack:activity-saved")
        );

        return updated;

      } catch (err) {

        console.error(err);

        setError(
          "Failed to update activity."
        );

        throw err;
      }
    };


  /* ===============================
     DELETE
  =============================== */

  const deleteActivity =
    async (id) => {

      try {

        await deleteActivityApi(
          id
        );

        setActivities(
          (previous) =>
            previous.filter(
              (activity) =>
                activity.id !== id
            )
        );

        window.dispatchEvent(
          new CustomEvent("ecotrack:activity-saved")
        );

      } catch (err) {

        console.error(err);

        setError(
          "Failed to delete activity."
        );

        throw err;
      }
    };


  /* ===============================
     TOTAL
  =============================== */

  const totalEmission =
    activities.reduce(
      (total, activity) =>
        total +
        Number(
          activity.emission || 0
        ),
      0
    );


  /* ===============================
     CATEGORY
  =============================== */

  const getCategoryEmission =
    (category) => {

      return activities
        .filter(
          (activity) =>
            activity.category ===
            category
        )
        .reduce(
          (total, activity) =>
            total +
            Number(
              activity.emission || 0
            ),
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


export function useActivities() {

  return useContext(
    ActivityContext
  );
}