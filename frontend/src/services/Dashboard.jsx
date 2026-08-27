import { useEffect, useState } from "react";

import { getDashboardData } from "../../services/dashboardService";

export default function Dashboard() {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    loadDashboard();

  }, []);


  async function loadDashboard() {

    try {

      setLoading(true);
      setError("");

      const result =
        await getDashboardData();

      setData(result);

    } catch (err) {

      console.error(err);

      if (err.message === "NO_TOKEN" || err.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Unable to load dashboard");
      }

    } finally {

      setLoading(false);
    }
  }


  if (loading) {

    return (
      <div className="dashboard-loading">
        Loading your EcoTrack data...
      </div>
    );
  }


  if (error) {

    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  if (!data) {

    return (
      <div className="dashboard-error">
        No dashboard data available.
      </div>
    );
  }


  return (
    <div>

      <h1>
        Sustainability Dashboard
      </h1>


      <div className="dashboard-cards">

        <div>
          <p>Carbon Footprint</p>

          <h2>
            {data.totalEmission} kg
          </h2>
        </div>


        <div>
          <p>Sustainability Score</p>

          <h2>
            {data.sustainabilityScore}
            /100
          </h2>
        </div>


        <div>
          <p>CO₂ Reduced</p>

          <h2>
            {data.co2Reduced} kg
          </h2>
        </div>


        <div>
          <p>Current Goal</p>

          <h2>
            {data.goalProgress}%
          </h2>
        </div>

      </div>


      <h2>
        Emissions by Category
      </h2>

      <pre>
        {JSON.stringify(
          data.categoryEmissions,
          null,
          2
        )}
      </pre>


      <h2>
        Monthly Emissions
      </h2>

      <pre>
        {JSON.stringify(
          data.monthlyEmissions,
          null,
          2
        )}
      </pre>

    </div>
  );
}