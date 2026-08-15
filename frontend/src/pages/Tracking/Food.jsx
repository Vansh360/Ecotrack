import { useState } from "react";
import { Leaf, Utensils } from "lucide-react";

export default function Food() {
  const [food, setFood] = useState("Vegetarian");
  const [meals, setMeals] = useState("");
  const [result, setResult] = useState(null);

  const factors = {
    Vegan: 0.5,
    Vegetarian: 1.0,
    Chicken: 2.5,
    Fish: 2.2,
    Beef: 6.5,
  };

  const calculate = (e) => {
    e.preventDefault();

    const number = Number(meals);

    if (!number || number < 0) {
      alert("Please enter a valid number of meals.");
      return;
    }

    const emission = number * factors[food];

    setResult(emission.toFixed(2));
  };

  return (
    <div className="tracking-page">

      <div className="tracking-header">

        <div className="tracking-icon">
          <Utensils size={24} />
        </div>

        <div>
          <span>TRACK EMISSIONS</span>

          <h1>Food</h1>

          <p>
            Understand the carbon impact of your food choices.
          </p>
        </div>

      </div>

      <div className="tracking-card">

        <form onSubmit={calculate}>

          <div className="tracking-form-grid">

            <div className="form-group">

              <label>
                Food Type
              </label>

              <select
                value={food}
                onChange={(e) => setFood(e.target.value)}
              >
                <option>Vegan</option>
                <option>Vegetarian</option>
                <option>Chicken</option>
                <option>Fish</option>
                <option>Beef</option>
              </select>

            </div>

            <div className="form-group">

              <label>
                Number of Meals
              </label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 3"
                value={meals}
                onChange={(e) => setMeals(e.target.value)}
              />

            </div>

          </div>

          <button
            type="submit"
            className="calculate-button"
          >
            Calculate CO₂
          </button>

        </form>

        {result !== null && (
          <div className="calculation-result">

            <Leaf size={30} />

            <span>
              Estimated Food Emissions
            </span>

            <strong>
              {result} kg CO₂e
            </strong>

            <small>
              Based on your selected food type.
            </small>

          </div>
        )}

      </div>

    </div>
  );
}