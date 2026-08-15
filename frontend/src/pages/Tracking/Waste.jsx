import { useState } from "react";
import {
  Droplets,
  Leaf,
  ShowerHead,
  Waves,
  GlassWater,
} from "lucide-react";

export default function Water() {
  const [dailyUsage, setDailyUsage] = useState("");
  const [result, setResult] = useState(null);

  const calculateWater = (e) => {
    e.preventDefault();

    const daily = Number(dailyUsage);

    if (!daily || daily <= 0) {
      alert("Please enter a valid daily water usage.");
      return;
    }

    const monthly = daily * 30;

    let score;

    if (daily <= 100) {
      score = 95;
    } else if (daily <= 150) {
      score = 85;
    } else if (daily <= 200) {
      score = 70;
    } else if (daily <= 250) {
      score = 55;
    } else {
      score = 40;
    }

    setResult({
      monthly,
      score,
    });
  };

  return (
    <div className="tracking-page">

      {/* HEADER */}

      <div className="tracking-header">

        <div className="tracking-icon">
          <Droplets size={24} />
        </div>

        <div>
          <span>TRACK CONSUMPTION</span>

          <h1>Water Consumption</h1>

          <p>
            Track your water usage and improve
            your water conservation habits.
          </p>
        </div>

      </div>

      {/* MAIN CARD */}

      <div className="tracking-card">

        <form onSubmit={calculateWater}>

          <div className="form-group">

            <label>
              Daily Water Consumption
            </label>

            <div className="water-input-wrapper">

              <Droplets size={18} />

              <input
                type="number"
                min="0"
                step="1"
                placeholder="Enter litres per day"
                value={dailyUsage}
                onChange={(e) =>
                  setDailyUsage(e.target.value)
                }
              />

              <span>Litres/day</span>

            </div>

            <small>
              Average household usage can vary depending
              on lifestyle and location.
            </small>

          </div>

          <button
            type="submit"
            className="calculate-button"
          >
            Calculate Usage
          </button>

        </form>

        {/* RESULT */}

        {result && (

          <div className="water-result-grid">

            <div className="water-result-card">

              <Droplets size={25} />

              <span>
                Monthly Usage
              </span>

              <strong>
                {result.monthly.toLocaleString()} L
              </strong>

            </div>

            <div className="water-result-card">

              <Leaf size={25} />

              <span>
                Conservation Score
              </span>

              <strong>
                {result.score}/100
              </strong>

            </div>

          </div>

        )}

      </div>

      {/* WATER TIPS */}

      <div className="water-tips">

        <h2>
          Water Conservation Tips
        </h2>

        <p>
          Small changes in daily habits can save
          thousands of litres every month.
        </p>

        <div className="water-tips-grid">

          <div className="water-tip-card">

            <div className="water-tip-icon">
              <ShowerHead size={20} />
            </div>

            <h3>
              Shorter Showers
            </h3>

            <p>
              Reduce shower time by a few minutes
              to conserve water.
            </p>

          </div>

          <div className="water-tip-card">

            <div className="water-tip-icon">
              <GlassWater size={20} />
            </div>

            <h3>
              Avoid Wastage
            </h3>

            <p>
              Turn off taps when water is not
              being actively used.
            </p>

          </div>

          <div className="water-tip-card">

            <div className="water-tip-icon">
              <Waves size={20} />
            </div>

            <h3>
              Reuse Water
            </h3>

            <p>
              Reuse suitable household water
              for plants and cleaning.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}