import {
  Menu,
  Bell,
  Plus,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Topbar({ onMenuClick, onAddActivity }) {
  return (
    <header className="dashboard-topbar">

      <div className="topbar-left">

        <button
          className="topbar-menu"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        <div>
          <span className="topbar-label">
            ECOTRACK
          </span>

          <h2>
            Sustainability Dashboard
          </h2>
        </div>

      </div>

      <div className="topbar-actions">

        <button className="topbar-add" onClick={onAddActivity}>

          <Plus size={15} />

          <span>
            Add Activity
          </span>

        </button>

        <button className="topbar-notification">
          <Bell size={17} />

          <span className="notification-dot" />
        </button>

        <Link
          to="/profile"
          className="topbar-profile"
        >
          <div className="topbar-avatar">
            <User size={16} />
          </div>

          <div>
            <strong>
              Vansh
            </strong>

            <span>
              Eco User
            </span>
          </div>
        </Link>

      </div>

    </header>
  );
}