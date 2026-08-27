import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Dashboard from "./pages/Dashboard/Dashboard";
import ActivityHistory from "./pages/Activities/ActivityHistory";

import Transportation from "./pages/Tracking/Transportation";
import Electricity from "./pages/Tracking/Electricity";
import Food from "./pages/Tracking/Food";
import Waste from "./pages/Tracking/Waste";
import Water from "./pages/Tracking/Water";

import Goals from "./pages/Goals/Goals";
import Advisor from "./pages/Advisor/Advisor";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Profile from "./pages/Profile/Profile";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import AddActivity
  from "./pages/Activity/AddActivity";

function App() {
  return (
    <Routes>

      {/* PUBLIC PAGES */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* PROTECTED APPLICATION */}

      <Route element={<ProtectedRoute />}>

        <Route element={<DashboardLayout />}>
           <Route
    path="/dashboard"
    element={<Dashboard />}
  />

  <Route
    path="/activity/add"
    element={<AddActivity />}
  />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/activities"
            element={<ActivityHistory />}
          />

          <Route
            path="/tracking/transportation"
            element={<Transportation />}
          />

          <Route
            path="/tracking/electricity"
            element={<Electricity />}
          />

          <Route
            path="/tracking/food"
            element={<Food />}
          />

          <Route
            path="/tracking/waste"
            element={<Waste />}
          />

          <Route
            path="/tracking/water"
            element={<Water />}
          />

          <Route
            path="/goals"
            element={<Goals />}
          />

          <Route
            path="/advisor"
            element={<Advisor />}
          />

          <Route
            path="/leaderboard"
            element={<Leaderboard />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Route>

    </Routes>
  );
}

export default App;