import { useState } from "react";
import {
  Target,
  Car,
  Zap,
  Recycle,
  Utensils,
  Leaf,
  CheckCircle,
  CalendarDays,
} from "lucide-react";

export default function Goals() {
  const [currentEmission, setCurrentEmission] = useState("420");
  const [targetEmission, setTargetEmission] = useState("250");
  const [targetDate, setTargetDate] = useState("");

  const [goalCreated, setGoalCreated] = useState(false);

  const current = Number(currentEmission);
  const target = Number(targetEmission);

  const reduction =
    current > target ? current - target : 0;

  const progress =
    current > 0 && target >= 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((current - target) / current) * 100
          )
        )
      : 0;

  const createGoal = (e) => {
    e.preventDefault();

    if (!current || !target) {
      alert("Please enter valid emission values.");
      return;
    }

    if (target >= current) {
      alert(
        "Your target should be lower than your current emission."
      );
      return;
    }

    setGoalCreated(true);
  };

  return (
    <div className="goals-page">

      {/* HEADER */}

      <div className="goals-header">

        <div className="goals-header-icon">
          <Target size={25} />
        </div>

        <div>
          <span>IMPROVE</span>

          <h1>
            Sustainability Goals
          </h1>

          <p>
            Set measurable targets and track your
            progress towards a greener lifestyle.
          </p>
        </div>

      </div>

      {/* GOAL CREATION */}

      <div className="goals-main-grid">

        <div className="goals-card">

          <div className="goals-card-header">

            <div>
              <h2>
                Create Carbon Goal
              </h2>

              <p>
                Set your monthly emission reduction target.
              </p>
            </div>

            <Target size={21} />

          </div>

          <form onSubmit={createGoal}>

            <div className="goals-form-grid">

              <div className="form-group">

                <label>
                  Current Monthly Emission
                </label>

                <input
                  type="number"
                  min="0"
                  value={currentEmission}
                  onChange={(e) =>
                    setCurrentEmission(e.target.value)
                  }
                />

                <small>
                  kg CO₂e / month
                </small>

              </div>

              <div className="form-group">

                <label>
                  Target Monthly Emission
                </label>

                <input
                  type="number"
                  min="0"
                  value={targetEmission}
                  onChange={(e) =>
                    setTargetEmission(e.target.value)
                  }
                />

                <small>
                  kg CO₂e / month
                </small>

              </div>

              <div className="form-group">

                <label>
                  Target Date
                </label>

                <div className="date-input">

                  <CalendarDays size={17} />

                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) =>
                      setTargetDate(e.target.value)
                    }
                  />

                </div>

              </div>

            </div>

            <button
              type="submit"
              className="calculate-button"
            >
              Create Goal
            </button>

          </form>

        </div>

        {/* PROGRESS */}

        <div className="goal-progress-card">

          <div className="goal-progress-circle">

            <strong>
              {Math.round(progress)}%
            </strong>

            <span>
              Progress
            </span>

          </div>

          <h3>
            Carbon Reduction Goal
          </h3>

          <p>
            Reduce your monthly emissions from{" "}
            <strong>{current} kg</strong> to{" "}
            <strong>{target} kg</strong>.
          </p>

          <div className="goal-large-progress">
            <div
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>

          <div className="goal-progress-info">

            <span>
              {reduction} kg CO₂ reduction needed
            </span>

            <span>
              Target: {target} kg
            </span>

          </div>

          {goalCreated && (
            <div className="goal-created-message">
              <CheckCircle size={16} />
              Goal created successfully!
            </div>
          )}

        </div>

      </div>

      {/* OTHER GOALS */}

      <div className="other-goals-section">

        <div className="section-title-row">

          <div>
            <h2>
              Sustainable Lifestyle Goals
            </h2>

            <p>
              Focus on different areas of your environmental
              impact.
            </p>
          </div>

        </div>

        <div className="other-goals-grid">

          <GoalCard
            icon={<Car size={21} />}
            title="Reduce Transportation"
            description="Use public transport or cycling twice a week."
            progress={65}
          />

          <GoalCard
            icon={<Zap size={21} />}
            title="Save Electricity"
            description="Reduce monthly electricity consumption."
            progress={48}
          />

          <GoalCard
            icon={<Utensils size={21} />}
            title="Sustainable Food"
            description="Choose low-carbon food options regularly."
            progress={72}
          />

          <GoalCard
            icon={<Recycle size={21} />}
            title="Increase Recycling"
            description="Recycle more household waste every month."
            progress={82}
          />

        </div>

      </div>

    </div>
  );
}

function GoalCard({
  icon,
  title,
  description,
  progress,
}) {
  return (
    <div className="other-goal-card">

      <div className="other-goal-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <div className="other-goal-progress">

        <div
          style={{
            width: `${progress}%`,
          }}
        ></div>

      </div>

      <div className="other-goal-footer">

        <span>
          Progress
        </span>

        <strong>
          {progress}%
        </strong>

      </div>

    </div>
  );
}