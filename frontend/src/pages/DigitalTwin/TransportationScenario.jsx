
import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Car,
  Leaf,
  Users,
  Zap,
  Info,
} from "lucide-react";
import { EMISSION_FACTORS } from "../../utils/emissionFactors";
import { SelectNative } from "@/components/ui/select-native";

const VEHICLES = [
  { value: "Car", label: "Car" },
  { value: "Bike", label: "Motorcycle" },
  { value: "Bus", label: "Bus" },
  { value: "Train", label: "Train" },
  { value: "Flight", label: "Flight" },
];

const FUEL_OPTIONS = {
  Car: ["petrol", "diesel"],
  Bike: ["petrol"],
};

const FREQUENCIES = [
  { value: "One Time", label: "One time" },
  { value: "Daily", label: "Daily (30 trips/month)" },
  { value: "Weekly", label: "Weekly (4 trips/month)" },
  { value: "Monthly", label: "Monthly" },
];

function getFactor(vehicle, fuel) {
  const transport = EMISSION_FACTORS.transportation;
  const key = vehicle.toLowerCase();

  if (key === "car") return transport.car?.[fuel];
  if (key === "bike") return transport.bike?.[fuel] || transport.bike?.petrol;
  if (key === "bus") return transport.bus?.default;
  if (key === "train") return transport.train?.default;
  if (key === "flight") return transport.flight?.default;

  return null;
}

function frequencyMultiplier(frequency) {
  if (frequency === "Daily") return 30;
  if (frequency === "Weekly") return 4;
  return 1;
}

function calculateScenario({
  vehicle,
  fuel,
  distance,
  frequency,
  passengers,
}) {
  const factor = getFactor(vehicle, fuel);

  if (!factor || !Number.isFinite(Number(factor.value))) {
    throw new Error(
      `No emission factor is configured for ${vehicle} (${fuel}).`
    );
  }

  const km = Number(distance);
  const passengerCount = Number(passengers);

  if (!Number.isFinite(km) || km <= 0) {
    throw new Error("Enter a distance greater than zero.");
  }

  if (!Number.isFinite(passengerCount) || passengerCount < 1) {
    throw new Error("Passenger count must be at least 1.");
  }

  const trips = frequencyMultiplier(frequency);
  const totalDistance = km * trips;
  const vehicleEmission = totalDistance * Number(factor.value);

  return {
    totalDistance,
    vehicleEmission,
    perPersonEmission: vehicleEmission / passengerCount,
    factor: Number(factor.value),
    factorUnit: factor.unit,
    source: factor.source || "Configured EcoTrack factor",
    region: factor.region || "Not specified",
    year: factor.year || "Not specified",
  };
}

export default function TransportationScenario() {
  const [vehicle, setVehicle] = useState("Car");
  const [fuel, setFuel] = useState("petrol");
  const [distance, setDistance] = useState("15");
  const [frequency, setFrequency] = useState("Daily");
  const [passengers, setPassengers] = useState("1");

  const [alternativeVehicle, setAlternativeVehicle] = useState("Bus");
  const [alternativeFuel, setAlternativeFuel] = useState("petrol");
  const [alternativePassengers, setAlternativePassengers] = useState("1");

  const [error, setError] = useState("");

  const result = useMemo(() => {
    try {
      const current = calculateScenario({
        vehicle,
        fuel,
        distance,
        frequency,
        passengers,
      });

      const alternative = calculateScenario({
        vehicle: alternativeVehicle,
        fuel: alternativeFuel,
        distance,
        frequency,
        passengers: alternativePassengers,
      });

      const saving =
        current.perPersonEmission - alternative.perPersonEmission;

      return {
        current,
        alternative,
        saving,
        savingPercent:
          current.perPersonEmission > 0
            ? (saving / current.perPersonEmission) * 100
            : 0,
      };
    } catch {
      return null;
    }
  }, [
    vehicle,
    fuel,
    distance,
    frequency,
    passengers,
    alternativeVehicle,
    alternativeFuel,
    alternativePassengers,
  ]);

  function updateVehicle(value, alternative = false) {
    if (alternative) {
      setAlternativeVehicle(value);
      if (!FUEL_OPTIONS[value]) setAlternativeFuel("petrol");
      else setAlternativeFuel(FUEL_OPTIONS[value][0]);
    } else {
      setVehicle(value);
      if (!FUEL_OPTIONS[value]) setFuel("petrol");
      else setFuel(FUEL_OPTIONS[value][0]);
    }
    setError("");
  }

  function runComparison() {
    try {
      calculateScenario({
        vehicle,
        fuel,
        distance,
        frequency,
        passengers,
      });
      calculateScenario({
        vehicle: alternativeVehicle,
        fuel: alternativeFuel,
        distance,
        frequency,
        passengers: alternativePassengers,
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="tracking-card transport-twin">
      <div className="transport-twin-heading">
        <div className="tracking-icon">
          <ArrowLeftRight size={23} />
        </div>
        <div>
          <span>WHAT-IF SIMULATION</span>
          <h2>Green Journey Comparator</h2>
          <p>
            Compare estimated emissions for the same distance using
            different travel modes.
          </p>
        </div>
      </div>

      <div className="transport-twin-grid">
        <div className="transport-twin-form">
          <h3><Car size={18} /> Current journey</h3>

          <div className="transport-twin-field-grid">
            <div className="transport-twin-field">
              <label htmlFor="twin-current-vehicle">Vehicle</label>
              <SelectNative id="twin-current-vehicle" value={vehicle} onChange={(e) => updateVehicle(e.target.value)}>
                {VEHICLES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </SelectNative>
            </div>
            {FUEL_OPTIONS[vehicle] && (
              <div className="transport-twin-field">
                <label htmlFor="twin-current-fuel">Fuel</label>
                <SelectNative id="twin-current-fuel" value={fuel} onChange={(e) => setFuel(e.target.value)}>
                  {FUEL_OPTIONS[vehicle].map((item) => <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>)}
                </SelectNative>
              </div>
            )}
          </div>

          <div className="transport-twin-field-grid">
            <div className="transport-twin-field">
              <label htmlFor="twin-distance">Distance per trip (km)</label>
              <input id="twin-distance" type="number" min="0.1" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div className="transport-twin-field">
              <label htmlFor="twin-frequency">Frequency</label>
              <SelectNative id="twin-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                {FREQUENCIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </SelectNative>
            </div>
          </div>

          <div className="transport-twin-field">
            <label htmlFor="twin-passengers">Passengers sharing the journey</label>
            <input id="twin-passengers" type="number" min="1" max="100" value={passengers} onChange={(e) => setPassengers(e.target.value)} />
            <small>The estimated vehicle emissions are divided by the passenger count to show a per-person comparison.</small>
          </div>
        </div>

        <div className="transport-twin-form">
          <h3><Leaf size={18} /> Greener alternative</h3>

          <div className="transport-twin-field">
            <label htmlFor="twin-alternative-vehicle">Alternative vehicle</label>
            <SelectNative id="twin-alternative-vehicle" value={alternativeVehicle} onChange={(e) => updateVehicle(e.target.value, true)}>
              {VEHICLES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </SelectNative>
          </div>

          {FUEL_OPTIONS[alternativeVehicle] && (
            <div className="transport-twin-field">
              <label htmlFor="twin-alternative-fuel">Fuel</label>
              <SelectNative id="twin-alternative-fuel" value={alternativeFuel} onChange={(e) => setAlternativeFuel(e.target.value)}>
                {FUEL_OPTIONS[alternativeVehicle].map((item) => <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>)}
              </SelectNative>
            </div>
          )}

          <div className="transport-twin-field">
            <label htmlFor="twin-alternative-passengers">Alternative passengers</label>
            <input id="twin-alternative-passengers" type="number" min="1" max="100" value={alternativePassengers} onChange={(e) => setAlternativePassengers(e.target.value)} />
          </div>

          <div className="transport-twin-note">
            <Users size={18} />
            <span>
              Both journeys use the same distance and frequency. Change
              the passenger count if the alternative journey is shared
              differently.
            </span>
          </div>

          <button
            type="button"
            className="calculate-button"
            onClick={runComparison}
          >
            <Zap size={16} />
            Validate comparison
          </button>
        </div>
      </div>

      {error && (
        <p className="transport-twin-error" role="alert">{error}</p>
      )}

      {result && (
        <div className="transport-twin-results">
          <div className="transport-twin-result-card">
            <span>Current journey</span>
            <strong>
              {result.current.perPersonEmission.toFixed(2)} kg CO₂e
            </strong>
            <small>
              {result.current.totalDistance.toFixed(1)} km total
            </small>
          </div>

          <div className="transport-twin-result-card">
            <span>Alternative journey</span>
            <strong>
              {result.alternative.perPersonEmission.toFixed(2)} kg CO₂e
            </strong>
            <small>
              {result.alternative.totalDistance.toFixed(1)} km total
            </small>
          </div>

          <div className="transport-twin-result-card transport-twin-saving">
            <span>Estimated difference per person</span>
            <strong>
              {result.saving >= 0 ? "−" : "+"}
              {Math.abs(result.saving).toFixed(2)} kg CO₂e
            </strong>
            <small>
              {result.saving >= 0
                ? `${result.savingPercent.toFixed(1)}% lower estimated emissions`
                : `${Math.abs(result.savingPercent).toFixed(1)}% higher estimated emissions`}
            </small>
          </div>

          <div className="transport-twin-disclaimer">
            <Info size={17} />
            <p>
              Estimates use the configured EcoTrack factors. They are only
              comparable when the factors have consistent units and
              calculation boundaries. Public transport factors may represent
              per-person kilometres; check each factor's unit before relying
              on the comparison.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
