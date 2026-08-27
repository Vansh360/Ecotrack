import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Activity,
  Car,
  Zap,
  Utensils,
  Recycle,
  Droplets,
  Target,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">
          🌱
        </div>

        <div>
          <strong>
            EcoTrack
          </strong>

          <span>
            Sustainability
          </span>
        </div>
      </div>


      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard"
          className="sidebar-link"
        >
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/activities"
          className="sidebar-link"
        >
          <Activity size={17} />
          <span>Activity History</span>
        </NavLink>


        <div className="sidebar-section-title">
          TRACK
        </div>


        <NavLink
          to="/tracking/transportation"
          className="sidebar-link"
        >
          <Car size={17} />
          <span>Transportation</span>
        </NavLink>


        <NavLink
          to="/tracking/electricity"
          className="sidebar-link"
        >
          <Zap size={17} />
          <span>Electricity</span>
        </NavLink>


        <NavLink
          to="/tracking/food"
          className="sidebar-link"
        >
          <Utensils size={17} />
          <span>Food</span>
        </NavLink>


        <NavLink
          to="/tracking/waste"
          className="sidebar-link"
        >
          <Recycle size={17} />
          <span>Waste</span>
        </NavLink>


        <NavLink
          to="/tracking/water"
          className="sidebar-link"
        >
          <Droplets size={17} />
          <span>Water</span>
        </NavLink>


        <div className="sidebar-section-title">
          IMPROVE
        </div>


        <NavLink
          to="/goals"
          className="sidebar-link"
        >
          <Target size={17} />
          <span>Goals</span>
        </NavLink>


        <NavLink
          to="/advisor"
          className="sidebar-link"
        >
          <Sparkles size={17} />
          <span>AI Advisor</span>
        </NavLink>


        <div className="sidebar-section-title">
          COMMUNITY
        </div>


        <NavLink
          to="/leaderboard"
          className="sidebar-link"
        >
          <Trophy size={17} />
          <span>Leaderboard</span>
        </NavLink>


        <NavLink
          to="/profile"
          className="sidebar-link"
        >
          <User size={17} />
          <span>Profile</span>
        </NavLink>

      </nav>

    </aside>
  );
}