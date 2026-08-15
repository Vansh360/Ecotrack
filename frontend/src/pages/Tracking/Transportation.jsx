import { useState } from "react";
import { Car, Leaf } from "lucide-react";

export default function Transportation() {

  const [form, setForm] = useState({
    vehicle: "Car",
    fuel: "Petrol",
    distance: "",
  });

  const [result, setResult] = useState(null);

  const emissionFactors = {
    Car: {
      Petrol: 0.192,
      Diesel: 0.171,
      Electric: 0.053,
    },

    Bike: {
      Petrol: 0.103,
      Diesel: 0.09,
      Electric: 0.03,
    },

    Bus: {
      Diesel: 0.105,
      Petrol: 0.105,
      Electric: 0.04,
    },

    Train: {
      Electric: 0.041,
      Diesel: 0.06,
      Petrol: 0.06,
    },
  };

  const calculate = (e) => {
    e.preventDefault();

    const distance = Number(form.distance);

    if (!distance) {
      alert("Please enter distance.");
      return;
    }

    const factor =
      emissionFactors[form.vehicle][form.fuel];

    const emission = distance * factor;

    setResult(emission.toFixed(2));
  };

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <Car size={24} />
        </div>

        <div>
          <span>TRACK EMISSIONS</span>

          <h1>
            Transportation
          </h1>

          <p>
            Calculate emissions from your daily travel.
          </p>
        </div>

      </div>

      <div className="tracking-card">

        <form onSubmit={calculate}>

          <div className="tracking-form-grid">

            <div className="form-group">

              <label>
                Vehicle Type
              </label>

              <select
                value={form.vehicle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    vehicle: e.target.value,
                  })
                }
              >
                <option>Car</option>
                <option>Bike</option>
                <option>Bus</option>
                <option>Train</option>
              </select>

            </div>

            <div className="form-group">

              <label>
                Fuel Type
              </label>

              <select
                value={form.fuel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fuel: e.target.value,
                  })
                }
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
              </select>

            </div>

            <div className="form-group">

              <label>
                Distance
              </label>

              <input
                type="number"
                min="0"
                placeholder="e.g. 15"
                value={form.distance}
                onChange={(e) =>
                  setForm({
                    ...form,
                    distance: e.target.value,
                  })
                }
              />

            </div>

          </div>

          <button
            className="calculate-button"
            type="submit"
          >
            Calculate CO₂
          </button>

        </form>

        {result && (

          <div className="calculation-result">

            <Leaf size={30} />

            <span>
              Estimated Emission
            </span>

            <strong>
              {result} kg CO₂e
            </strong>

            <small>
              Based on your entered distance and
              selected transportation mode.
            </small>

          </div>

        )}

      </div>

    </div>
  );
}