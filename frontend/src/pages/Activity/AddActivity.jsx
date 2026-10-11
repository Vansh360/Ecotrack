import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Zap, Utensils, Recycle, Droplets, ArrowLeft, Save } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Field from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const categories = [
  { id: "Transportation", label: "Transportation", icon: Car },
  { id: "Electricity", label: "Electricity", icon: Zap },
  { id: "Food", label: "Food", icon: Utensils },
  { id: "Waste", label: "Waste", icon: Recycle },
  { id: "Water", label: "Water", icon: Droplets },
];

const activityTypesByCategory = {
  Transportation: [
    { value: "CAR", label: "Car", factor: 0.21 },
    { value: "BUS", label: "Bus", factor: 0.08 },
    { value: "TRAIN", label: "Train", factor: 0.04 },
    { value: "BIKE", label: "Bike", factor: 0.0 },
    { value: "WALK", label: "Walk", factor: 0.0 },
  ],
  Electricity: [{ value: "GRID", label: "Grid electricity", factor: 0.71 }],
  Food: [
    { value: "VEGETARIAN", label: "Vegetarian meal", factor: 1.5 },
    { value: "NON_VEGETARIAN", label: "Non-vegetarian meal", factor: 3.5 },
  ],
  Waste: [
    { value: "GENERAL_WASTE", label: "General Household Waste", factor: 1.5 },
    { value: "FOOD_WASTE", label: "Food Waste", factor: 0.8 },
    { value: "PLASTIC_WASTE", label: "Plastic Waste", factor: 2.5 },
    { value: "PAPER_WASTE", label: "Paper & Cardboard", factor: 1.3 },
    { value: "GLASS_WASTE", label: "Glass Waste", factor: 0.5 },
    { value: "METAL_WASTE", label: "Metal / Cans", factor: 1.2 },
    { value: "E_WASTE", label: "Electronic Waste", factor: 1.8 },
    { value: "TEXTILE_WASTE", label: "Clothes & Textile Waste", factor: 1.4 },
    { value: "ORGANIC_WASTE", label: "Organic / Garden Waste", factor: 0.4 },
    { value: "HAZARDOUS_WASTE", label: "Hazardous Waste", factor: 2.4 },
    { value: "MEDICAL_WASTE", label: "Medical Waste", factor: 2.1 },
    { value: "CONSTRUCTION_WASTE", label: "Construction Waste", factor: 1.7 },
  ],
  Water: [
    { value: "DRINKING_WATER", label: "Drinking Water", factor: 0.0003 },
    { value: "SHOWER_BATH", label: "Shower / Bath", factor: 0.0003 },
    { value: "TOILET_FLUSHING", label: "Toilet Flushing", factor: 0.0003 },
    { value: "LAUNDRY", label: "Laundry", factor: 0.0003 },
    { value: "DISHWASHING", label: "Dishwashing", factor: 0.0003 },
    { value: "GARDENING", label: "Gardening & Plants", factor: 0.0003 },
    { value: "CAR_WASHING", label: "Car Washing", factor: 0.0003 },
    { value: "HOUSE_CLEANING", label: "House Cleaning", factor: 0.0003 },
    { value: "COOKING", label: "Cooking", factor: 0.0003 },
    { value: "RAINWATER_REUSED", label: "Rainwater / Reused Water", factor: 0.0001 },
  ],
};

const defaultUnitFor = {
  Transportation: "km",
  Electricity: "kWh",
  Food: "servings",
  Waste: "kg",
  Water: "L",
};

export default function AddActivity() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Electricity");
  const [activityType, setActivityType] = useState("GRID");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kWh");
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const getSelectedFactor = () => {
    const options = activityTypesByCategory[category] || [];
    const selected = options.find((item) => item.value === activityType);
    return selected ? selected.factor : 0;
  };

  const calculateEmission = () => {
    const value = Number(quantity);
    if (!value || value <= 0) return 0;
    return value * getSelectedFactor();
  };

  const handleCategorySelect = (id) => {
    setCategory(id);
    const options = activityTypesByCategory[id] || [];
    setActivityType(options[0]?.value || "");
    setUnit(defaultUnitFor[id] || "");
    setMessage("");
    setMessageType("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!quantity || Number(quantity) <= 0) {
      setMessage("Please enter a valid quantity.");
      setMessageType("error");
      return;
    }
    if (!activityType) {
      setMessage("Please select an activity type.");
      setMessageType("error");
      return;
    }
    if (!unit) {
      setMessage("Please select a unit.");
      setMessageType("error");
      return;
    }
    if (!activityDate) {
      setMessage("Please select an activity date.");
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || token === "development-token") {
      setMessage("Your session is invalid. Please login again.");
      setMessageType("error");
      return;
    }

    const activityData = {
      category: category,
      activityType: activityType,
      quantity: Number(quantity),
      unit: unit,
      activityDate: activityDate,
      metadata: `${category} activity`,
    };

    console.log("Saving activity:", activityData);

    try {
      setSaving(true);
      const response = await fetch("http://localhost:8080/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      });

      const responseText = await response.text();
      let responseData = null;
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseData = null;
      }

      console.log("Backend status:", response.status);
      console.log("Backend response:", responseData || responseText);

      if (!response.ok) {
        let errorMessage = "Failed to save activity.";
        if (responseData?.message) errorMessage = responseData.message;
        else if (responseText) errorMessage = responseText;
        if (response.status === 401) errorMessage = "Session expired. Please login again.";
        if (response.status === 403) errorMessage = "Access denied. Please login again.";
        if (response.status === 500) {
          errorMessage =
            responseData?.message ||
            "Backend error while saving activity. Check the Spring Boot terminal.";
        }
        throw new Error(errorMessage);
      }

      console.log("Activity saved successfully:", responseData);
      setMessage("Activity saved successfully!");
      setMessageType("success");
      setQuantity("");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("SAVE ACTIVITY ERROR:", error);
      setMessage(error.message || "Unable to save activity.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Button variant="ghost" className="w-fit" onClick={() => navigate("/dashboard")}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </Button>

      <PageHeader
        eyebrow="EcoTrack"
        title="Add Activity"
        description="Record your daily activity to calculate your carbon footprint."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border px-3 py-5 transition-all",
              category === id
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            )}
            onClick={() => handleCategorySelect(id)}
          >
            <Icon size={24} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSave}>
            <Field label="Activity Type">
              <SelectNative value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                {(activityTypesByCategory[category] || []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectNative>
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Quantity">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Field>
              <Field label="Unit">
                <SelectNative value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="km">km</option>
                  <option value="kWh">kWh</option>
                  <option value="litres">litres</option>
                  <option value="kg">kg</option>
                  <option value="servings">servings</option>
                </SelectNative>
              </Field>
            </div>

            <Field label="Activity Date">
              <Input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
              />
            </Field>

            <div className="rounded-2xl border border-primary/25 bg-primary/10 px-6 py-6 text-center">
              <span className="text-xs tracking-widest text-muted-foreground uppercase">
                Estimated CO₂ Emission
              </span>
              <strong className="mt-2 block font-display text-4xl text-primary">
                {calculateEmission().toFixed(2)} kg CO₂e
              </strong>
            </div>

            {message && (
              <Alert variant={messageType === "success" ? "success" : "destructive"}>
                {message}
              </Alert>
            )}

            <Button type="submit" size="lg" disabled={saving}>
              <Save size={18} />
              {saving ? "Saving..." : "Save Activity"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
