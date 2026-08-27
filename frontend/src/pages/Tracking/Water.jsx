import { useState } from "react";
import {
  Droplets,
  Calculator,
  CheckCircle,
} from "lucide-react";

import { useActivities } from "../../context/ActivityContext";
import {
  calculateWaterEmission,
} from "../../utils/carbonCalculator";

export default function Water() {
  const { addActivity } = useActivities();

  const [usage, setUsage] = useState("");
  const [emission, setEmission] = useState(null);
  const [saved, setSaved] = useState(false);

  const calculateEmission = () => {
    const litres = Number(usage);

    if (!litres || litres <= 0) {
      alert("Please enter a valid water usage.");
      return;
    }

    try {
      const result = calculateWaterEmission(litres);

      setEmission(result.emission);
      setSaved(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const saveActivity = () => {
    if (emission === null) {
      alert("Please calculate the emission first.");
      return;
    }

    const result = calculateWaterEmission(Number(usage));

    addActivity({
      category: "Water",
      activityType: "Water Consumption",
      quantity: Number(usage),
      unit: "litres",
      emission: result.emission,
      emissionFactor: result.factor,
      emissionFactorUnit: result.factorUnit,
      factorSource: result.source,
      factorRegion: result.region,
      factorYear: result.year,
      calculationBoundary: result.boundary,
      details: `${usage} litres water`,
    });

    setSaved(true);
  };

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <Droplets size={25} />
        </div>

        <div>
          <span>TRACK</span>

          <h1>
            Water Consumption
          </h1>

          <p>
            Track your daily water consumption.
          </p>
        </div>

      </div>

      <div className="tracking-card">

        <div className="form-group">

          <label>
            Daily Water Usage
          </label>

          <input
            type="number"
            min="0"
            placeholder="Enter water usage in litres"
            value={usage}
            onChange={(e) => {
              setUsage(e.target.value);
              setEmission(null);
              setSaved(false);
            }}
          />

          <small>
            Example: 150 litres
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
              Based on {usage} litres of water consumption
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