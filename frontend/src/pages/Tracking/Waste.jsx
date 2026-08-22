import { useState } from "react";
import {
  Recycle,
  Calculator,
  CheckCircle,
} from "lucide-react";

import { useActivities } from "../../context/ActivityContext";

export default function Waste() {
  const { addActivity } = useActivities();

  const [wasteType, setWasteType] = useState("Plastic");
  const [quantity, setQuantity] = useState("");

  const [emission, setEmission] = useState(null);
  const [saved, setSaved] = useState(false);

  /*
    Temporary frontend factors.
    These will later be moved to the backend.
  */
  const emissionFactors = {
    Plastic: 2.5,
    Paper: 1.3,
    "Food Waste": 0.8,
    "General Waste": 1.5,
    Recycling: 0.4,
  };

  const calculateEmission = () => {
    const kg = Number(quantity);

    if (!kg || kg <= 0) {
      alert("Please enter a valid waste quantity.");
      return;
    }

    const factor = emissionFactors[wasteType];

    const result = kg * factor;

    setEmission(Number(result.toFixed(2)));
    setSaved(false);
  };

  const saveActivity = () => {
    if (emission === null) {
      alert("Please calculate the emission first.");
      return;
    }

    addActivity({
      category: "Waste",
      activityType: wasteType,
      quantity: Number(quantity),
      unit: "kg",
      emission,
      details: `${wasteType} waste`,
    });

    setSaved(true);
  };

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <Recycle size={25} />
        </div>

        <div>
          <span>TRACK</span>

          <h1>
            Waste Management
          </h1>

          <p>
            Track waste generation and recycling activities.
          </p>
        </div>

      </div>

      <div className="tracking-card">

        <div className="form-group">

          <label>
            Waste Type
          </label>

          <select
            value={wasteType}
            onChange={(e) => {
              setWasteType(e.target.value);
              setEmission(null);
              setSaved(false);
            }}
          >
            <option value="Plastic">
              Plastic
            </option>

            <option value="Paper">
              Paper
            </option>

            <option value="Food Waste">
              Food Waste
            </option>

            <option value="General Waste">
              General Waste
            </option>

            <option value="Recycling">
              Recycling
            </option>
          </select>

        </div>

        <div
          className="form-group"
          style={{ marginTop: 15 }}
        >

          <label>
            Waste Quantity
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Enter waste quantity in kg"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setEmission(null);
              setSaved(false);
            }}
          />

          <small>
            Example: 2 kg
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
              {quantity} kg {wasteType} ×{" "}
              {emissionFactors[wasteType]} kg CO₂/kg
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