import { useState } from "react";
import { Utensils, Calculator, CheckCircle } from "lucide-react";
import { useActivities } from "../../context/ActivityContext";
import { calculateFoodEmission } from "../../utils/carbonCalculator";
import PageHeader from "@/components/common/PageHeader";
import Field from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";

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
      const result = calculateFoodEmission({ foodType, quantity: kg });
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
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={Utensils}
        eyebrow="Track"
        title="Food"
        description="Estimate the carbon footprint of your food consumption."
      />
      <Card>
        <CardContent className="flex flex-col gap-5">
          <Field label="Food Type">
            <SelectNative
              value={foodType}
              onChange={(e) => {
                setFoodType(e.target.value);
                setEmission(null);
                setSaved(false);
              }}
            >
              <option value="Vegan">Vegan</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Chicken">Chicken</option>
              <option value="Fish">Fish</option>
              <option value="Beef">Beef</option>
            </SelectNative>
          </Field>
          <Field label="Quantity" hint="Example: 1 kg">
            <Input
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
          </Field>
          <Button onClick={calculateEmission}>
            <Calculator size={14} />
            Calculate CO₂
          </Button>
          {emission !== null && (
            <div className="rounded-2xl border border-primary/25 bg-primary/10 px-6 py-6 text-center">
              <span className="text-xs tracking-widest text-muted-foreground uppercase">
                Estimated Carbon Emission
              </span>
              <strong className="mt-2 block font-display text-4xl text-primary">
                {emission} kg CO₂
              </strong>
              <small className="mt-2 block text-xs text-muted-foreground">
                {quantity} kg {foodType} × {Number(emission) / Number(quantity)} kg CO₂/kg
              </small>
            </div>
          )}
          {emission !== null && (
            <Button onClick={saveActivity} disabled={saved}>
              <CheckCircle size={15} />
              {saved ? "Activity Saved" : "Save Activity"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
