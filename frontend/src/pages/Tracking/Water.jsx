import { useState } from "react";
import { Droplets, CheckCircle } from "lucide-react";
import { useActivities } from "../../context/ActivityContext";
import { calculateWaterEmission } from "../../utils/carbonCalculator";
import PageHeader from "@/components/common/PageHeader";
import Field from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { Alert } from "@/components/ui/alert";

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
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={Droplets}
        eyebrow="Track"
        title="Water Usage"
        description="Track your household water consumption and understand its impact."
      />
      <Card>
        <CardContent className="flex flex-col gap-5">
          <Field label="Water Type" htmlFor="waterType">
            <SelectNative
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
            </SelectNative>
          </Field>
          <Field label="Water Quantity" htmlFor="quantity" hint="Example: 80 L">
            <Input
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
          </Field>
          <Field label="Details (Optional)" htmlFor="details">
            <Textarea
              id="details"
              rows="4"
              placeholder="Add any additional information..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Field>
          {error && <Alert variant="destructive">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          {estimatedEmission !== null && (
            <div className="rounded-2xl border border-primary/25 bg-primary/10 px-6 py-6 text-center">
              <span className="text-xs tracking-widest text-muted-foreground uppercase">
                Estimated Carbon Emission
              </span>
              <strong className="mt-2 block font-display text-4xl text-primary">
                {estimatedEmission.toFixed(4)} kg CO₂
              </strong>
              <small className="mt-2 block text-xs text-muted-foreground">
                Based on {quantity} L of{" "}
                {WATER_TYPES.find((type) => type.value === waterType)?.label || "water"}
              </small>
            </div>
          )}
          <Button onClick={handleSave} disabled={saving || saved}>
            <CheckCircle size={15} />
            {saving ? "Saving..." : saved ? "Activity Saved" : "Save Activity"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
