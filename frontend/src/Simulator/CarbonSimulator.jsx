import { useMemo, useState } from "react";
import {
  ArrowRight,
} from "lucide-react";

import {
  simulateEmissionChange,
} from "../utils/sustainabilityEngine";

const OPTIONS = {
  Car: {
    factor: 0.174,
    unit: "kg CO₂e/km",
  },

  Bus: {
    factor: 0.104,
    unit: "kg CO₂e/person/km",
  },

  Train: {
    factor: 0.035,
    unit: "kg CO₂e/person/km",
  },
};

export default function CarbonSimulator() {

  const [distance, setDistance] =
    useState(100);

  const [currentMode, setCurrentMode] =
    useState("Car");

  const [alternativeMode, setAlternativeMode] =
    useState("Bus");

  const result = useMemo(() => {

    const current =
      OPTIONS[currentMode];

    const alternative =
      OPTIONS[alternativeMode];

    return simulateEmissionChange({
      currentQuantity:
        Number(distance),

      currentFactor:
        current.factor,

      alternativeQuantity:
        Number(distance),

      alternativeFactor:
        alternative.factor,
    });

  }, [
    distance,
    currentMode,
    alternativeMode,
  ]);

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <ArrowRight size={25} />
        </div>

        <div>
          <span>SIMULATE</span>

          <h1>
            Carbon Simulator
          </h1>

          <p>
            Compare different choices
            before making them.
          </p>
        </div>

      </div>


      <div className="tracking-card">

        <div className="form-group">

          <label>
            Distance
          </label>

          <input
            type="number"
            min="1"
            value={distance}
            onChange={(e) =>
              setDistance(
                e.target.value
              )
            }
          />

          <small>
            Enter distance in kilometres.
          </small>

        </div>


        <div className="form-group">

          <label>
            Current Transport
          </label>

          <select
            value={currentMode}
            onChange={(e) =>
              setCurrentMode(
                e.target.value
              )
            }
          >

            <option value="Car">
              🚗 Car
            </option>

            <option value="Bus">
              🚌 Bus
            </option>

            <option value="Train">
              🚆 Train
            </option>

          </select>

        </div>


        <div className="form-group">

          <label>
            Alternative Transport
          </label>

          <select
            value={alternativeMode}
            onChange={(e) =>
              setAlternativeMode(
                e.target.value
              )
            }
          >

            <option value="Car">
              🚗 Car
            </option>

            <option value="Bus">
              🚌 Bus
            </option>

            <option value="Train">
              🚆 Train
            </option>

          </select>

        </div>


        <div className="calculation-result">

          <span>
            Current Emission
          </span>

          <strong>
            {result.current} kg CO₂e
          </strong>

        </div>


        <div className="calculation-result">

          <span>
            Alternative Emission
          </span>

          <strong>
            {result.alternative} kg CO₂e
          </strong>

        </div>


        <div className="calculation-result">

          <span>
            Potential Reduction
          </span>

          <strong>
            {result.reduction} kg CO₂e
          </strong>

          <small>
            {result.percentage}% reduction
          </small>

        </div>


        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "14px",
            background: "#edf8f1",
          }}
        >

          <strong>
            🌱 Recommendation
          </strong>

          <p>
            Switching from{" "}
            <b>{currentMode}</b>{" "}
            to{" "}
            <b>{alternativeMode}</b>{" "}
            could reduce approximately{" "}
            <b>
              {result.reduction}
              {" kg CO₂e"}
            </b>{" "}
            for this distance.
          </p>

        </div>

      </div>

    </div>
  );
}