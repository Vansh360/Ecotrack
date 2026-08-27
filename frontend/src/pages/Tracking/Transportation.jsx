import { useState } from "react";
import {
  Car,
  Calculator,
  CheckCircle,
} from "lucide-react";

import { useActivities } from "../../context/ActivityContext";
import {
  calculateTransportationEmission,
} from "../../utils/carbonCalculator";

export default function Transportation() {
  const { addActivity } = useActivities();

  const [vehicle, setVehicle] = useState("Car");
  const [fuel, setFuel] = useState("Petrol");
  const [distance, setDistance] = useState("");

  const [emission, setEmission] = useState(null);
  const [saved, setSaved] = useState(false);

  const calculateEmission = () => {
    const km = Number(distance);

    if (!km || km <= 0) {
      alert("Please enter a valid distance.");
      return;
    }

    try {
      const result = calculateTransportationEmission({
        vehicle,
        fuel,
        distance: km,
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

    const result = calculateTransportationEmission({
      vehicle,
      fuel,
      distance: Number(distance),
    });

    addActivity({
      category: "Transportation",
      activityType: vehicle,
      quantity: Number(distance),
      unit: "km",
      emission: result.emission,
      emissionFactor: result.factor,
      emissionFactorUnit: result.factorUnit,
      factorSource: result.source,
      factorRegion: result.region,
      factorYear: result.year,
      calculationBoundary: result.boundary,
      details:
        vehicle === "Car"
          ? `${fuel} car`
          : vehicle,
    });

    setSaved(true);
  };

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <Car size={25} />
        </div>

        <div>
          <span>
            TRACK
          </span>

          <h1>
            Transportation
          </h1>

          <p>
            Calculate emissions from your daily travel.
          </p>
        </div>

      </div>

      <div className="tracking-card">

        <div className="form-group">
          <label>
            Vehicle Type
          </label>

          <select
            value={vehicle}
            onChange={(e) => {
              setVehicle(e.target.value);
              setEmission(null);
              setSaved(false);
            }}
          >
            <option value="Car">
              Car
            </option>

            <option value="Bike">
              Bike
            </option>

            <option value="Bus">
              Bus
            </option>

            <option value="Train">
              Train
            </option>

            <option value="Flight">
              Flight
            </option>
          </select>
        </div>

        {vehicle === "Car" && (
          <div
            className="form-group"
            style={{ marginTop: 15 }}
          >
            <label>
              Fuel Type
            </label>

            <select
              value={fuel}
              onChange={(e) =>
                setFuel(e.target.value)
              }
            >
              <option value="Petrol">
                Petrol
              </option>

              <option value="Diesel">
                Diesel
              </option>
            </select>
          </div>
        )}

        <div
          className="form-group"
          style={{ marginTop: 15 }}
        >
          <label>
            Distance Travelled
          </label>

          <input
            type="number"
            min="0"
            placeholder="Enter distance in km"
            value={distance}
            onChange={(e) => {
              setDistance(e.target.value);
              setEmission(null);
              setSaved(false);
            }}
          />

          <small>
            Example: 15 km
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
              Based on {distance} km of {vehicle.toLowerCase()} travel
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