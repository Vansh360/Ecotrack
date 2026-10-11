import { useState } from "react";
import { Recycle, CheckCircle } from "lucide-react";
import { useActivities } from "../../context/ActivityContext";
import PageHeader from "@/components/common/PageHeader";
import Field from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { Alert } from "@/components/ui/alert";

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
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={Recycle}
        eyebrow="Track"
        title="Waste Management"
        description="Track waste generation and recycling activities."
      />
      <Card>
        <CardContent className="flex flex-col gap-5">
          <Field label="Waste Type">
            <SelectNative
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
            </SelectNative>
          </Field>
          <Field label="Waste Quantity" hint="Example: 2 kg">
            <Input
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
          </Field>
          <Field label="Additional Details (Optional)">
            <Textarea
              rows="4"
              placeholder="Example: Plastic bottles, food packaging, old clothes..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Field>
          {error && <Alert variant="destructive">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Button onClick={handleSubmit} disabled={saving}>
            <CheckCircle size={15} />
            {saving ? "Saving..." : "Save Activity"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
