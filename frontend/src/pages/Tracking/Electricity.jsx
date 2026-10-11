import { useState } from "react";
import { Zap, Calculator, CheckCircle } from "lucide-react";
import { useActivities } from "../../context/ActivityContext";
import { calculateElectricityEmission } from "../../utils/carbonCalculator";
import PageHeader from "@/components/common/PageHeader";
import Field from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Electricity() {
  const { addActivity } = useActivities();
  const [units, setUnits] = useState("");
  const [emission, setEmission] = useState(null);
  const [saved, setSaved] = useState(false);

  const calculateEmission = () => {
    const kwh = Number(units);
    if (!kwh || kwh <= 0) {
      alert("Please enter a valid electricity consumption.");
      return;
    }
    try {
      const result = calculateElectricityEmission(kwh);
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
    const result = calculateElectricityEmission(Number(units));
    addActivity({
      category: "Electricity",
      activityType: "Electricity Consumption",
      quantity: Number(units),
      unit: "kWh",
      emission: result.emission,
      emissionFactor: result.factor,
      emissionFactorUnit: result.factorUnit,
      factorSource: result.source,
      factorRegion: result.region,
      factorYear: result.year,
      calculationBoundary: result.boundary,
      details: `${units} kWh electricity`,
    });
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={Zap}
        eyebrow="Track"
        title="Electricity"
        description="Track your household electricity consumption."
      />
      <Card>
        <CardContent className="flex flex-col gap-5">
          <Field
            label="Electricity Consumption"
            hint="Enter your electricity usage in kWh. Example: 250 kWh"
          >
            <Input
              type="number"
              min="0"
              placeholder="Enter electricity usage"
              value={units}
              onChange={(e) => {
                setUnits(e.target.value);
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
                {units} kWh × {Number(emission) / Number(units)} kg CO₂/kWh
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
