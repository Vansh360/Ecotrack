import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Car,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Flag,
  Home,
  Leaf,
  LogOut,
  Menu,
  Recycle,
  Sparkles,
  Trophy,
  Utensils,
  User,
  X,
  Zap,
} from "lucide-react";

import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <Home size={19} />,
        },
      ],
    },
    {
      title: "Track Emissions",
      items: [
        {
          name: "Transportation",
          path: "/tracking/transportation",
          icon: <Car size={19} />,
        },
        {
          name: "Electricity",
          path: "/tracking/electricity",
          icon: <Zap size={19} />,
        },
        {
          name: "Food",
          path: "/tracking/food",
          icon: <Utensils size={19} />,
        },
        {
          name: "Waste",
          path: "/tracking/waste",
          icon: <Recycle size={19} />,
        },
        {
          name: "Water",
          path: "/tracking/water",
          icon: <Droplets size={19} />,
        },
      ],
    },
    {
      title: "Improve",
      items: [
        {
          name: "Goals",
          path: "/goals",
          icon: <Flag size={19} />,
        },
        {
          name: "AI Advisor",
          path: "/advisor",
          icon: <Sparkles size={19} />,
        },
        {
          name: "Leaderboard",
          path: "/leaderboard",
          icon: <Trophy size={19} />,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          name: "Profile",
          path: "/profile",
          icon: <User size={19} />,
        },
      ],
    },
  ];

  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>

      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Leaf size={20} />
        </div>

        {!collapsed && (
          <span>
            Eco<span>Track</span>
          </span>
        )}
      </div>

      <div className="sidebar-menu">

        {menu.map((section) => (
          <div
            className="sidebar-section"
            key={section.title}
          >

            {!collapsed && (
              <div className="sidebar-section-title">
                {section.title}
              </div>
            )}

            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active"
                    : "sidebar-link"
                }
                title={collapsed ? item.name : ""}
              >
                {item.icon}

                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </NavLink>
            ))}

          </div>
        ))}

      </div>

      <div className="sidebar-bottom">

        <button
          className="sidebar-collapse"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}

          {!collapsed && (
            <span>Collapse</span>
          )}
        </button>

        <button className="sidebar-logout">
          <LogOut size={18} />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>

      </div>

    </aside>
  );
}