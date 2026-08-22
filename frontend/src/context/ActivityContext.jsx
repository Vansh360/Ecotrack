import { createContext, useContext, useEffect, useState } from "react";

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem("ecotrack_activities");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "ecotrack_activities",
      JSON.stringify(activities)
    );
  }, [activities]);

  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now(),
      date: new Date().toISOString(),

      ...activity,
    };

    setActivities((previous) => [
      newActivity,
      ...previous,
    ]);

    return newActivity;
  };

  const deleteActivity = (id) => {
    setActivities((previous) =>
      previous.filter(
        (activity) => activity.id !== id
      )
    );
  };

  const clearActivities = () => {
    setActivities([]);
    localStorage.removeItem("ecotrack_activities");
  };

  const totalEmission = activities.reduce(
    (total, activity) =>
      total + Number(activity.emission || 0),
    0
  );

  const getCategoryEmission = (category) => {
    return activities
      .filter(
        (activity) =>
          activity.category === category
      )
      .reduce(
        (total, activity) =>
          total + Number(activity.emission || 0),
        0
      );
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        deleteActivity,
        clearActivities,
        totalEmission,
        getCategoryEmission,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  return useContext(ActivityContext);
}