import {
  LayoutDashboard,
  Car,
  Zap,
  Utensils,
  Recycle,
  Droplets,
  Target,
  Sparkles,
  Trophy,
  User,
  LogOut,
  Leaf,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ mobileOpen, setMobileOpen }) {

  const navigate = useNavigate();

  const closeMobile = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menu = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <LayoutDashboard size={17} />,
        },
      ],
    },

    {
      title: "Track",
      items: [
        {
          name: "Transportation",
          path: "/tracking/transportation",
          icon: <Car size={17} />,
        },
        {
          name: "Electricity",
          path: "/tracking/electricity",
          icon: <Zap size={17} />,
        },
        {
          name: "Food",
          path: "/tracking/food",
          icon: <Utensils size={17} />,
        },
        {
          name: "Waste",
          path: "/tracking/waste",
          icon: <Recycle size={17} />,
        },
        {
          name: "Water",
          path: "/tracking/water",
          icon: <Droplets size={17} />,
        },
      ],
    },

    {
      title: "Improve",
      items: [
        {
          name: "Goals",
          path: "/goals",
          icon: <Target size={17} />,
        },
        {
          name: "AI Advisor",
          path: "/advisor",
          icon: <Sparkles size={17} />,
        },
        {
          name: "Leaderboard",
          path: "/leaderboard",
          icon: <Trophy size={17} />,
        },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >

        {/* LOGO */}

        <div className="sidebar-header">

          <NavLink
            to="/dashboard"
            className="sidebar-logo"
            onClick={closeMobile}
          >

            <div className="sidebar-logo-icon">
              <Leaf size={19} />
            </div>

            <div>
              <strong>
                EcoTrack
              </strong>

              <span>
                Sustainability
              </span>
            </div>

          </NavLink>

          <button
            className="sidebar-close"
            onClick={closeMobile}
          >
            <X size={19} />
          </button>

        </div>

        {/* NAVIGATION */}

        <div className="sidebar-navigation">

          {menu.map((section) => (

            <div
              className="sidebar-section"
              key={section.title}
            >

              <span className="sidebar-section-title">
                {section.title}
              </span>

              {section.items.map((item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive
                        ? "sidebar-link-active"
                        : ""
                    }`
                  }
                >
                  {item.icon}
                  <span>
                    {item.name}
                  </span>
                </NavLink>

              ))}

            </div>

          ))}

        </div>

        {/* BOTTOM */}

        <div className="sidebar-bottom">

          <NavLink
            to="/profile"
            onClick={closeMobile}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "sidebar-link-active"
                  : ""
              }`
            }
          >
            <User size={17} />
            Profile
          </NavLink>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}