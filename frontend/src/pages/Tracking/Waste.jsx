import { useState } from "react";
import { Recycle, CheckCircle } from "lucide-react";

import { useActivities } from "../../context/ActivityContext";

const WASTE_TYPES = [
  { value: "GENERAL_WASTE", label: "General Household Waste" },
  { value: "FOOD_WASTE", label: "Food Waste" },
  { value: "PLASTIC_WASTE", label: "Plastic Waste" },
  { value: "PAPER_WASTE", label: "Paper & Cardboard" },
  { value: "GLASS_WASTE", label: "Glass Waste" },
  { value: "METAL_WASTE", label: "Metal / Cans" },
  { value: "E_WASTE", label: "Electronic Waste" },
  { value: "TEXTILE_WASTE", label: "Clothes & Textile Waste" },
  { value: "ORGANIC_WASTE", label: "Organic / Garden Waste" },
  { value: "HAZARDOUS_WASTE", label: "Hazardous Waste" },
  { value: "MEDICAL_WASTE", label: "Medical Waste" },
  { value: "CONSTRUCTION_WASTE", label: "Construction Waste" },
];

export default function Waste() {
  const { addActivity } = useActivities();

  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const kg = Number(quantity);

    if (!wasteType) {
      setError("Please select a waste type.");
      return;
    }

    if (!quantity || kg <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await addActivity({
        category: "WASTE",
        activityType: wasteType,
        quantity: kg,
        unit: "kg",
        details: details.trim() || `${wasteType} waste`,
      });

      setMessage("Waste activity saved successfully!");
      setWasteType("");
      setQuantity("");
      setDetails("");
    } catch (err) {
      console.error("Waste activity save failed:", err);
      setError(err.message || "Failed to save waste activity.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <div className="tracking-icon">
          <Recycle size={25} />
        </div>

        <div>
          <span>TRACK</span>
          <h1>Waste Management</h1>
          <p>Track waste generation and recycling activities.</p>
        </div>
      </div>

      <div className="tracking-card">
        <div className="form-group">
          <label>Waste Type</label>
          <select
            value={wasteType}
            onChange={(e) => {
              setWasteType(e.target.value);
              setError("");
              setMessage("");
            }}
          >
            <option value="">Select waste type</option>
            {WASTE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginTop: 15 }}>
          <label>Waste Quantity</label>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Enter waste quantity in kg"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError("");
              setMessage("");
            }}
          />
          <small>Example: 2 kg</small>
        </div>

        <div className="form-group" style={{ marginTop: 15 }}>
          <label>Additional Details (Optional)</label>
          <textarea
            rows="4"
            placeholder="Example: Plastic bottles, food packaging, old clothes..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <button
          className="save-activity-button"
          onClick={handleSubmit}
          disabled={saving}
        >
          <CheckCircle size={15} />
          {saving ? "Saving..." : "Save Activity"}
        </button>
      </div>
    </div>
  );
}