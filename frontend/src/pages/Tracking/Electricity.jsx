import { useState } from "react";
import {
  Zap,
  Calculator,
  CheckCircle,
} from "lucide-react";

import { useActivities } from "../../context/ActivityContext";

export default function Electricity() {
  const { addActivity } = useActivities();

  const [units, setUnits] = useState("");
  const [emission, setEmission] = useState(null);
  const [saved, setSaved] = useState(false);

  // Temporary frontend emission factor.
  // This will later come from the backend/database.
  const ELECTRICITY_FACTOR = 0.82;

  const calculateEmission = () => {
    const kwh = Number(units);

    if (!kwh || kwh <= 0) {
      alert("Please enter a valid electricity consumption.");
      return;
    }

    const result = kwh * ELECTRICITY_FACTOR;

    setEmission(Number(result.toFixed(2)));
    setSaved(false);
  };

  const saveActivity = () => {
    if (emission === null) {
      alert("Please calculate the emission first.");
      return;
    }

    addActivity({
      category: "Electricity",
      activityType: "Electricity Consumption",
      quantity: Number(units),
      unit: "kWh",
      emission,
      details: `${units} kWh electricity`,
    });

    setSaved(true);
  };

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <Zap size={25} />
        </div>

        <div>
          <span>TRACK</span>

          <h1>
            Electricity
          </h1>

          <p>
            Track your household electricity consumption.
          </p>
        </div>

      </div>

      <div className="tracking-card">

        <div className="form-group">

          <label>
            Electricity Consumption
          </label>

          <input
            type="number"
            min="0"
            placeholder="Enter electricity usage"
            value={units}
            onChange={(e) => {
              setUnits(e.target.value);
              setEmission(null);
              setSaved(false);
            }}
          />

          <small>
            Enter your electricity usage in kWh.
            Example: 250 kWh
          </small>

        </div>

        <button
          className="calculate-button"
          onClick={calculateEmission}
        >
          <Calculator
            size={14}
            style={{
              marginRight: 6,
              verticalAlign: "middle",
            }}
          />

          Calculate CO₂
        </button>

        {emission !== null && (
          <div className="calculation-result">

            <span>
              Estimated Carbon Emission
            </span>

            <strong>
              {emission} kg CO₂
            </strong>

            <small>
              {units} kWh × {ELECTRICITY_FACTOR} kg CO₂/kWh
            </small>

          </div>
        )}

        {emission !== null && (
          <button
            className="save-activity-button"
            onClick={saveActivity}
            disabled={saved}
          >
            <CheckCircle size={15} />

            {saved
              ? "Activity Saved"
              : "Save Activity"}
          </button>
        )}

      </div>

    </div>
  );
}