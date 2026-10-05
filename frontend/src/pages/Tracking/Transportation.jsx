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
import {
  calculateTransportationEmission,
} from "../../utils/carbonCalculator";

export default function Transportation() {
  const { addActivity } = useActivities();

  // =========================
  // BASIC TRANSPORT DETAILS
  // =========================

  const [vehicle, setVehicle] = useState("Car");
  const [fuel, setFuel] = useState("Petrol");

  // =========================
  // USAGE DETAILS
  // =========================

  const [distance, setDistance] = useState("");
  const [frequency, setFrequency] = useState("One Time");
  const [passengers, setPassengers] = useState("1");

  // =========================
  // VEHICLE EFFICIENCY
  // =========================

  const [efficiency, setEfficiency] = useState("");

  // =========================
  // ELECTRIC VEHICLE DETAILS
  // =========================

  const [chargingSource, setChargingSource] = useState("Grid");

  // =========================
  // ADDITIONAL DETAILS
  // =========================

  const [details, setDetails] = useState("");

  // =========================
  // RESULT
  // =========================

  const [emission, setEmission] = useState(null);
  const [saved, setSaved] = useState(false);

  // =========================
  // RESET RESULT
  // =========================

  const resetResult = () => {
    setEmission(null);
    setSaved(false);
  };

  // =========================
  // VEHICLE CHANGE
  // =========================

  const handleVehicleChange = (value) => {
    setVehicle(value);

    resetResult();

    // Reset fuel when changing vehicle
    if (value !== "Car") {
      setFuel("Petrol");
    }

    // Reset efficiency
    setEfficiency("");
  };

  // =========================
  // FUEL CHANGE
  // =========================

  const handleFuelChange = (value) => {
    setFuel(value);
    resetResult();
  };

  // =========================
  // CALCULATE EMISSION
  // =========================

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

  // =========================
  // SAVE ACTIVITY
  // =========================

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

      // Build additional information
      const activityDetails = [
        vehicle,
        fuel ? `${fuel} fuel` : null,
        `Distance: ${km} km`,
        `Frequency: ${frequency}`,
        `Passengers: ${passengers}`,
        efficiency
          ? `Efficiency: ${efficiency} km/L`
          : null,
        vehicle === "Electric"
          ? `Charging: ${chargingSource}`
          : null,
        details.trim()
          ? `Details: ${details.trim()}`
          : null,
      ]
        .filter(Boolean)
        .join(" | ");

      addActivity({
        category: "Transportation",

        // Keep existing activity type compatible
        // with your current emission-factor system.
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
    <div className="tracking-page">

      {/* =========================
          HEADER
      ========================= */}

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

        {/* =========================
            VEHICLE TYPE
        ========================= */}

        <div className="form-group">

          <label>
            <Car size={16} />
            Vehicle Type
          </label>

          <select
            value={vehicle}
            onChange={(e) =>
              handleVehicleChange(e.target.value)
            }
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

            <option value="Auto Rickshaw">
              Auto Rickshaw
            </option>

            <option value="SUV">
              SUV
            </option>

            <option value="Van">
              Van
            </option>

            <option value="Truck">
              Truck
            </option>

            <option value="Electric">
              Electric Vehicle
            </option>

          </select>

        </div>

        {/* =========================
            FUEL TYPE
        ========================= */}

        {vehicle !== "Train" &&
          vehicle !== "Flight" &&
          vehicle !== "Electric" && (

          <div
            className="form-group"
            style={{ marginTop: 15 }}
          >

            <label>
              <Fuel size={16} />
              Fuel Type
            </label>

            <select
              value={fuel}
              onChange={(e) =>
                handleFuelChange(e.target.value)
              }
            >

              <option value="Petrol">
                Petrol
              </option>

              <option value="Diesel">
                Diesel
              </option>

              <option value="CNG">
                CNG
              </option>

              <option value="LPG">
                LPG
              </option>

            </select>

          </div>
        )}

        {/* =========================
            EV CHARGING SOURCE
        ========================= */}

        {vehicle === "Electric" && (

          <div
            className="form-group"
            style={{ marginTop: 15 }}
          >

            <label>
              <Zap size={16} />
              Charging Source
            </label>

            <select
              value={chargingSource}
              onChange={(e) => {
                setChargingSource(e.target.value);
                resetResult();
              }}
            >

              <option value="Grid">
                Electricity Grid
              </option>

              <option value="Solar">
                Solar
              </option>

              <option value="Wind">
                Wind / Renewable
              </option>

              <option value="Other Renewable">
                Other Renewable
              </option>

            </select>

          </div>
        )}

        {/* =========================
            DISTANCE
        ========================= */}

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
            step="0.1"
            placeholder="Enter distance in km"
            value={distance}
            onChange={(e) => {
              setDistance(e.target.value);
              resetResult();
            }}
          />

          <small>
            Example: 15 km
          </small>

        </div>

        {/* =========================
            FREQUENCY
        ========================= */}

        <div
          className="form-group"
          style={{ marginTop: 15 }}
        >

          <label>
            <CalendarDays size={16} />
            Travel Frequency
          </label>

          <select
            value={frequency}
            onChange={(e) => {
              setFrequency(e.target.value);
              resetResult();
            }}
          >

            <option value="One Time">
              One Time
            </option>

            <option value="Daily">
              Daily
            </option>

            <option value="Weekly">
              Weekly
            </option>

            <option value="Monthly">
              Monthly
            </option>

          </select>

        </div>

        {/* =========================
            PASSENGERS
        ========================= */}

        <div
          className="form-group"
          style={{ marginTop: 15 }}
        >

          <label>
            <Users size={16} />
            Number of Passengers
          </label>

          <input
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

          <small>
            Include yourself as one passenger.
          </small>

        </div>

        {/* =========================
            FUEL EFFICIENCY
        ========================= */}

        {vehicle !== "Train" &&
          vehicle !== "Flight" &&
          vehicle !== "Electric" && (

          <div
            className="form-group"
            style={{ marginTop: 15 }}
          >

            <label>
              <Gauge size={16} />
              Fuel Efficiency
            </label>

            <input
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

            <small>
              Enter vehicle efficiency in km/L.
            </small>

          </div>
        )}

        {/* =========================
            DETAILS
        ========================= */}

        <div
          className="form-group"
          style={{ marginTop: 15 }}
        >

          <label>
            Additional Details
          </label>

          <textarea
            rows="3"
            placeholder="Example: Daily office commute"
            value={details}
            onChange={(e) =>
              setDetails(e.target.value)
            }
          />

        </div>

        {/* =========================
            CALCULATE
        ========================= */}

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

        {/* =========================
            RESULT
        ========================= */}

        {emission !== null && (

          <div className="calculation-result">

            <span>
              Estimated Carbon Emission
            </span>

            <strong>
              {Number(emission).toFixed(2)} kg CO₂
            </strong>

            <small>
              Based on {distance} km of{" "}
              {vehicle.toLowerCase()} travel
            </small>

            <small>
              {passengers} passenger
              {Number(passengers) !== 1 ? "s" : ""}
              {" • "}
              {frequency}
            </small>

          </div>

        )}

        {/* =========================
            SAVE
        ========================= */}

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