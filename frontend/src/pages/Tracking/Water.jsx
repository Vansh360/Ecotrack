import { useState } from "react";
import { Droplets, CheckCircle } from "lucide-react";

import { useActivities } from "../../context/ActivityContext";
import { calculateWaterEmission } from "../../utils/carbonCalculator";

const WATER_TYPES = [
  { value: "DRINKING_WATER", label: "Drinking Water" },
  { value: "SHOWER_BATH", label: "Shower / Bath" },
  { value: "TOILET_FLUSHING", label: "Toilet Flushing" },
  { value: "LAUNDRY", label: "Laundry" },
  { value: "DISHWASHING", label: "Dishwashing" },
  { value: "GARDENING", label: "Gardening & Plants" },
  { value: "CAR_WASHING", label: "Car Washing" },
  { value: "HOUSE_CLEANING", label: "House Cleaning" },
  { value: "COOKING", label: "Cooking" },
  { value: "RAINWATER_REUSED", label: "Rainwater / Reused Water" },
];

export default function Water() {
  const { addActivity } = useActivities();

  const [waterType, setWaterType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");
  const [estimatedEmission, setEstimatedEmission] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateEstimate = (value) => {
    const litres = Number(value);

    if (!value || litres <= 0) {
      setEstimatedEmission(null);
      return;
    }

    const result = calculateWaterEmission(litres);
    setEstimatedEmission(result.emission);
  };

  const handleSave = async () => {
    const litres = Number(quantity);

    if (!waterType) {
      setError("Please select a water type.");
      return;
    }

    if (!quantity || litres <= 0) {
      setError("Please enter a valid water quantity.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await addActivity({
        category: "WATER",
        activityType: waterType,
        quantity: litres,
        unit: "L",
        details: details || `${waterType} water use`,
      });

      const result = calculateWaterEmission(litres);
      setEstimatedEmission(result.emission);
      setSaved(true);
      setMessage("Water activity saved successfully!");
      setWaterType("");
      setQuantity("");
      setDetails("");
    } catch (err) {
      console.error("Water activity save failed:", err);
      setError(err.message || "Failed to save water activity.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <div className="tracking-icon">
          <Droplets size={25} />
        </div>

        <div>
          <span>TRACK</span>
          <h1>Water Usage</h1>
          <p>Track your household water consumption and understand its impact.</p>
        </div>
      </div>

      <div className="tracking-card">
        <div className="form-group">
          <label htmlFor="waterType">Water Type</label>
          <select
            id="waterType"
            value={waterType}
            onChange={(e) => {
              setWaterType(e.target.value);
              setError("");
              setSaved(false);
              setMessage("");
            }}
          >
            <option value="">Select Water Type</option>
            {WATER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginTop: 15 }}>
          <label htmlFor="quantity">Water Quantity</label>
          <input
            id="quantity"
            type="number"
            min="0"
            step="0.1"
            placeholder="Enter quantity in litres"
            value={quantity}
            onChange={(e) => {
              const nextValue = e.target.value;
              setQuantity(nextValue);
              setError("");
              setSaved(false);
              setMessage("");
              updateEstimate(nextValue);
            }}
          />
          <small>Example: 80 L</small>
        </div>

        <div className="form-group" style={{ marginTop: 15 }}>
          <label htmlFor="details">Details (Optional)</label>
          <textarea
            id="details"
            rows="4"
            placeholder="Add any additional information..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {estimatedEmission !== null && (
          <div className="calculation-result">
            <span>Estimated Carbon Emission</span>
            <strong>{estimatedEmission.toFixed(4)} kg CO₂</strong>
            <small>
              Based on {quantity} L of {WATER_TYPES.find((type) => type.value === waterType)?.label || "water"}
            </small>
          </div>
        )}

        <button
          className="save-activity-button"
          onClick={handleSave}
          disabled={saving || saved}
        >
          <CheckCircle size={15} />
          {saving ? "Saving..." : saved ? "Activity Saved" : "Save Activity"}
        </button>
      </div>
    </div>
  );
}