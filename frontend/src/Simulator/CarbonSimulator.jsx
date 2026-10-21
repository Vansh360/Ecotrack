import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";

const SCENARIOS = {
  electricity: {
    label: "Reduce electricity use",
    activityLabel: "Baseline electricity use (kWh)",
    changeLabel: "Electricity reduction",
  },
  transport: {
    label: "Increase public transport",
    activityLabel: "Baseline car travel (km)",
    changeLabel: "Car travel replaced by bus",
  },
  solar: {
    label: "Campus solar adoption",
    activityLabel: "Baseline electricity demand (kWh)",
    changeLabel: "Electricity demand supplied by solar",
  },
};

export default function CarbonSimulator() {
  const [scenario, setScenario] = useState("electricity");
  const [baseline, setBaseline] = useState("300");
  const [change, setChange] = useState(20);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runSimulation(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/simulations/what-if", {
        scenario,
        baselineValue: Number(baseline),
        changePercent: Number(change),
      });
      setResult(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || requestError.message
          || "Unable to run simulation."
      );
    } finally {
      setLoading(false);
    }
  }

  const chartData = result
    ? [
        { name: "Baseline", emissions: result.baselineEmissions },
        { name: "Simulated", emissions: result.simulatedEmissions },
      ]
    : [];

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <div className="tracking-icon">
          <ArrowRight size={25} />
        </div>
        <div>
          <span>SIMULATE</span>
          <h1>What-If Environmental Simulator</h1>
          <p>
            Explore hypothetical changes. Results are estimates,
            not measured real-world reductions.
          </p>
        </div>
      </div>

      <form className="tracking-card" onSubmit={runSimulation}>
        <div className="tracking-form-grid">
          <div className="form-group">
            <label htmlFor="simulation-scenario">Scenario</label>
            <select
              id="simulation-scenario"
              value={scenario}
              onChange={(event) => {
                setScenario(event.target.value);
                setResult(null);
              }}
            >
              {Object.entries(SCENARIOS).map(([value, option]) => (
                <option key={value} value={value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="simulation-baseline">
              {SCENARIOS[scenario].activityLabel}
            </label>
            <input
              id="simulation-baseline"
              type="number"
              min="0"
              step="any"
              required
              value={baseline}
              onChange={(event) => setBaseline(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="simulation-change">
              {SCENARIOS[scenario].changeLabel}: {change}%
            </label>
            <input
              id="simulation-change"
              type="range"
              min="0"
              max="100"
              value={change}
              onChange={(event) => setChange(Number(event.target.value))}
            />
          </div>
        </div>

        <button className="calculate-button" type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Run simulation"}
        </button>

        {error && <p role="alert">{error}</p>}

        {result && (
          <section aria-live="polite">
            <h2>Estimated results</h2>
            <div className="tracking-form-grid">
              <div className="calculation-result">
                <span>Baseline emissions</span>
                <strong>{result.baselineEmissions.toFixed(2)}</strong>
                <small>{result.unit}</small>
              </div>
              <div className="calculation-result">
                <span>Simulated emissions</span>
                <strong>{result.simulatedEmissions.toFixed(2)}</strong>
                <small>{result.unit}</small>
              </div>
              <div className="calculation-result">
                <span>Estimated avoided emissions</span>
                <strong>{result.co2eAvoided.toFixed(2)}</strong>
                <small>{result.unit}</small>
              </div>
            </div>

            <div style={{ width: "100%", height: 300, marginTop: 24 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="emissions" name={result.unit} fill="#1f7a4d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <h3>Assumptions</h3>
            <p>{result.assumptions}</p>
            <p>
              <strong>Simulation only:</strong> This estimate is not proof
              that emissions were actually reduced.
            </p>
          </section>
        )}
      </form>
    </div>
  );
}
