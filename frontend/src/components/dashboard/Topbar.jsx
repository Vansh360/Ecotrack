import {
  Bell,
  ChevronDown,
  Leaf,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Topbar() {
  return (
    <header className="dashboard-topbar">

      <div className="mobile-logo">
        <Leaf size={20} />
        <span>
          Eco<span>Track</span>
        </span>
      </div>

      <div className="dashboard-search">

        <Search size={17} />

        <input
          type="text"
          placeholder="Search..."
        />

      </div>

      <div className="topbar-actions">

        <button className="notification-button">
          <Bell size={19} />

          <span className="notification-dot"></span>
        </button>

        <Link
          to="/profile"
          className="profile-mini"
        >

          <div className="profile-avatar">
            V
          </div>

          <div className="profile-info">
            <strong>Vansh</strong>
            <span>Eco User</span>
          </div>

          <ChevronDown size={15} />

        </Link>

      </div>

    </header>
  );
}