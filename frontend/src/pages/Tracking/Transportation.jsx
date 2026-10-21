import { useState } from "react";
import {
  Car,
  Calculator,
  CheckCircle,
  Users,
  Fuel,
  Gauge,
  CalendarDays,
  Zap,
} from "lucide-react";
import { useActivities } from "../../context/ActivityContext";
import { calculateTransportationEmission } from "../../utils/carbonCalculator";
import PageHeader from "@/components/common/PageHeader";
import Field from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import AutoTripDetection from "../../components/environment/AutoTripDetection";

export default function Transportation() {
  const { addActivity } = useActivities();
  const [vehicle, setVehicle] = useState("Car");
  const [fuel, setFuel] = useState("Petrol");
  const [distance, setDistance] = useState("");
  const [frequency, setFrequency] = useState("One Time");
  const [passengers, setPassengers] = useState("1");
  const [efficiency, setEfficiency] = useState("");
  const [chargingSource, setChargingSource] = useState("Grid");
  const [details, setDetails] = useState("");
  const [emission, setEmission] = useState(null);
  const [saved, setSaved] = useState(false);

  const resetResult = () => {
    setEmission(null);
    setSaved(false);
  };

  const handleVehicleChange = (value) => {
    setVehicle(value);
    resetResult();
    if (value !== "Car") setFuel("Petrol");
    setEfficiency("");
  };

  const handleFuelChange = (value) => {
    setFuel(value);
    resetResult();
  };

  const calculateEmission = () => {
    const km = Number(distance);
    if (!km || km <= 0) {
      alert("Please enter a valid distance.");
      return;
    }
    if (!passengers || Number(passengers) <= 0) {
      alert("Please enter a valid number of passengers.");
      return;
    }
    try {
      const result = calculateTransportationEmission({
        vehicle,
        fuel,
        distance: km,
        efficiency,
        frequency,
        passengers,
        chargingSource,
      });
      setEmission(Number(result.emission));
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
    const km = Number(distance);
    try {
      const result = calculateTransportationEmission({
        vehicle,
        fuel,
        distance: km,
        efficiency,
        frequency,
        passengers,
        chargingSource,
      });
      const activityDetails = [
        vehicle,
        fuel ? `${fuel} fuel` : null,
        `Distance: ${km} km`,
        `Frequency: ${frequency}`,
        `Passengers: ${passengers}`,
        efficiency ? `Efficiency: ${efficiency} km/L` : null,
        vehicle === "Electric" ? `Charging: ${chargingSource}` : null,
        details.trim() ? `Details: ${details.trim()}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      addActivity({
        category: "Transportation",
        activityType: vehicle,
        quantity: km,
        unit: "km",
        emission: result.emission,
        emissionFactor: result.factor,
        emissionFactorUnit: result.factorUnit,
        factorSource: result.source,
        factorRegion: result.region,
        factorYear: result.year,
        calculationBoundary: result.boundary,
        details: activityDetails,
      });
      setSaved(true);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={Car}
        eyebrow="Track"
        title="Transportation"
        description="Calculate emissions from your daily travel."
      />
      <AutoTripDetection />
      <Card>
        <CardContent className="flex flex-col gap-5">
          <Field label="Vehicle Type" icon={Car}>
            <SelectNative value={vehicle} onChange={(e) => handleVehicleChange(e.target.value)}>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Flight">Flight</option>
              <option value="Auto Rickshaw">Auto Rickshaw</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
              <option value="Electric">Electric Vehicle</option>
            </SelectNative>
          </Field>

          {vehicle !== "Train" && vehicle !== "Flight" && vehicle !== "Electric" && (
            <Field label="Fuel Type" icon={Fuel}>
              <SelectNative value={fuel} onChange={(e) => handleFuelChange(e.target.value)}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="LPG">LPG</option>
              </SelectNative>
            </Field>
          )}

          {vehicle === "Electric" && (
            <Field label="Charging Source" icon={Zap}>
              <SelectNative
                value={chargingSource}
                onChange={(e) => {
                  setChargingSource(e.target.value);
                  resetResult();
                }}
              >
                <option value="Grid">Electricity Grid</option>
                <option value="Solar">Solar</option>
                <option value="Wind">Wind / Renewable</option>
                <option value="Other Renewable">Other Renewable</option>
              </SelectNative>
            </Field>
          )}

          <Field label="Distance Travelled" hint="Example: 15 km">
            <Input
              type="number"
              min="0"
              step="0.1"
              placeholder="Enter distance in km"
              value={distance}
              onChange={(e) => {
                setDistance(e.target.value);
                resetResult();
              }}
            />
          </Field>

          <Field label="Travel Frequency" icon={CalendarDays}>
            <SelectNative
              value={frequency}
              onChange={(e) => {
                setFrequency(e.target.value);
                resetResult();
              }}
            >
              <option value="One Time">One Time</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </SelectNative>
          </Field>

          <Field label="Number of Passengers" icon={Users} hint="Include yourself as one passenger.">
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="Example: 2"
              value={passengers}
              onChange={(e) => {
                setPassengers(e.target.value);
                resetResult();
              }}
            />
          </Field>

          {vehicle !== "Train" && vehicle !== "Flight" && vehicle !== "Electric" && (
            <Field label="Fuel Efficiency" icon={Gauge} hint="Enter vehicle efficiency in km/L.">
              <Input
                type="number"
                min="0"
                step="0.1"
                placeholder="Example: 15"
                value={efficiency}
                onChange={(e) => {
                  setEfficiency(e.target.value);
                  resetResult();
                }}
              />
            </Field>
          )}

          <Field label="Additional Details">
            <Textarea
              rows="3"
              placeholder="Example: Daily office commute"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
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
                {Number(emission).toFixed(2)} kg CO₂
              </strong>
              <small className="mt-2 block text-xs text-muted-foreground">
                Based on {distance} km of {vehicle.toLowerCase()} travel
              </small>
              <small className="text-xs text-muted-foreground">
                {passengers} passenger{Number(passengers) !== 1 ? "s" : ""} • {frequency}
              </small>
            </div>
          )}

          {emission !== null && (
            <Button onClick={saveActivity} disabled={saved} variant={saved ? "secondary" : "default"}>
              <CheckCircle size={15} />
              {saved ? "Activity Saved" : "Save Activity"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
