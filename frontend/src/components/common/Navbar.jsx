import { useState } from "react";
import {
  Leaf,
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Target,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="main-navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="navbar-logo"
        onClick={closeMenu}
      >
        <div className="navbar-logo-icon">
          <Leaf size={20} />
        </div>

        <div>
          <strong>EcoTrack</strong>
          <span>Track. Reduce. Sustain.</span>
        </div>
      </Link>

      {/* DESKTOP NAVIGATION */}

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/dashboard">
          <LayoutDashboard size={15} />
          Dashboard
        </Link>

        <Link to="/goals">
          <Target size={15} />
          Goals
        </Link>

        <Link to="/advisor">
          <Sparkles size={15} />
          AI Advisor
        </Link>

        <Link to="/leaderboard">
          <Trophy size={15} />
          Leaderboard
        </Link>

      </div>

      {/* DESKTOP AUTH */}

      <div className="navbar-actions">

        <button
          className="navbar-login"
          onClick={() => navigate("/login")}
        >
          <LogIn size={15} />
          Login
        </button>

        <button
          className="navbar-register"
          onClick={() => navigate("/register")}
        >
          <UserPlus size={15} />
          Get Started
        </button>

      </div>

      {/* MOBILE BUTTON */}

      <button
        className="navbar-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="mobile-navbar-menu">

          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link
            to="/dashboard"
            onClick={closeMenu}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </Link>

          <Link
            to="/goals"
            onClick={closeMenu}
          >
            <Target size={15} />
            Goals
          </Link>

          <Link
            to="/advisor"
            onClick={closeMenu}
          >
            <Sparkles size={15} />
            AI Advisor
          </Link>

          <Link
            to="/leaderboard"
            onClick={closeMenu}
          >
            <Trophy size={15} />
            Leaderboard
          </Link>

          <div className="mobile-navbar-divider" />

          <Link
            to="/login"
            onClick={closeMenu}
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={closeMenu}
            className="mobile-register"
          >
            Get Started
          </Link>

        </div>
      )}

    </nav>
  );
}