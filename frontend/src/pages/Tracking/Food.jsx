import { useState } from "react";
import {
  Utensils,
  Calculator,
  CheckCircle,
} from "lucide-react";

import { useActivities } from "../../context/ActivityContext";
import {
  calculateFoodEmission,
} from "../../utils/carbonCalculator";

export default function Food() {
  const { addActivity } = useActivities();

  const [foodType, setFoodType] = useState("Vegetarian");
  const [quantity, setQuantity] = useState("");

  const [emission, setEmission] = useState(null);
  const [saved, setSaved] = useState(false);

  const calculateEmission = () => {
    const kg = Number(quantity);

    if (!kg || kg <= 0) {
      alert("Please enter a valid food quantity.");
      return;
    }

    try {
      const result = calculateFoodEmission({
        foodType,
        quantity: kg,
      });

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

    const result = calculateFoodEmission({
      foodType,
      quantity: Number(quantity),
    });

    addActivity({
      category: "Food",
      activityType: foodType,
      quantity: Number(quantity),
      unit: "kg",
      emission: result.emission,
      emissionFactor: result.factor,
      emissionFactorUnit: result.factorUnit,
      factorSource: result.source,
      factorRegion: result.region,
      factorYear: result.year,
      calculationBoundary: result.boundary,
      details: `${foodType} food`,
    });

    setSaved(true);
  };

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <Utensils size={25} />
        </div>

        <div>
          <span>TRACK</span>

          <h1>
            Food
          </h1>

          <p>
            Estimate the carbon footprint of your food consumption.
          </p>
        </div>

      </div>

      <div className="tracking-card">

        <div className="form-group">

          <label>
            Food Type
          </label>

          <select
            value={foodType}
            onChange={(e) => {
              setFoodType(e.target.value);
              setEmission(null);
              setSaved(false);
            }}
          >
            <option value="Vegan">
              Vegan
            </option>

            <option value="Vegetarian">
              Vegetarian
            </option>

            <option value="Chicken">
              Chicken
            </option>

            <option value="Fish">
              Fish
            </option>

            <option value="Beef">
              Beef
            </option>
          </select>

        </div>

        <div
          className="form-group"
          style={{ marginTop: 15 }}
        >

          <label>
            Quantity
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Enter quantity in kg"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setEmission(null);
              setSaved(false);
            }}
          />

          <small>
            Example: 1 kg
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
              {quantity} kg {foodType} ×{" "}
              {Number(emission) / Number(quantity)} kg CO₂/kg
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