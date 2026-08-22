import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const GoalContext = createContext();

export function GoalProvider({ children }) {
  const [goal, setGoal] = useState(() => {
    try {
      const saved = localStorage.getItem("ecotrack_goal");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (goal) {
      localStorage.setItem("ecotrack_goal", JSON.stringify(goal));
    } else {
      localStorage.removeItem("ecotrack_goal");
    }
  }, [goal]);

  const createGoal = ({ baselineEmission, targetEmission, targetDate }) => {
    setGoal({
      id: Date.now(),
      baselineEmission: Number(baselineEmission),
      targetEmission: Number(targetEmission),
      targetDate,
      createdAt: new Date().toISOString(),
    });
  };

  const deleteGoal = () => setGoal(null);

  return (
    <GoalContext.Provider value={{ goal, createGoal, deleteGoal }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoal() {
  return useContext(GoalContext);
}
