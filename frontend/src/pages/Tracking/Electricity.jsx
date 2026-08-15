import { useState } from "react";
import { Leaf, Zap } from "lucide-react";

export default function Electricity() {
  const [units, setUnits] = useState("");
  const [result, setResult] = useState(null);

  // Example emission factor
  // This will later be moved to the backend/database.
  const emissionFactor = 0.82;

  const calculate = (e) => {
    e.preventDefault();

    const value = Number(units);

    if (!value || value < 0) {
      alert("Please enter a valid electricity consumption.");
      return;
    }

    const emission = value * emissionFactor;

    setResult(emission.toFixed(2));
  };

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <Zap size={24} />
        </div>

        <div>
          <span>TRACK EMISSIONS</span>

          <h1>Electricity</h1>

          <p>
            Track your electricity consumption and
            estimate its carbon footprint.
          </p>
        </div>

      </div>

      <div className="tracking-card">

        <form onSubmit={calculate}>

          <div className="form-group">

            <label>
              Monthly Electricity Consumption
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter electricity usage in kWh"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            />

            <small>
              Example: 250 kWh
            </small>

          </div>

          <button
            type="submit"
            className="calculate-button"
          >
            Calculate CO₂
          </button>

        </form>

        {result !== null && (
          <div className="calculation-result">

            <Leaf size={30} />

            <span>
              Estimated Electricity Emissions
            </span>

            <strong>
              {result} kg CO₂e
            </strong>

            <small>
              Calculation: {units} kWh × {emissionFactor}
            </small>

          </div>
        )}

      </div>

    </div>
  );
}