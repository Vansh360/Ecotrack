import {
  Leaf,
  Github,
  Linkedin,
  Mail,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="main-footer">

      <div className="footer-container">

        {/* BRAND */}

        <div className="footer-brand">

          <Link to="/" className="footer-logo">

            <div className="footer-logo-icon">
              <Leaf size={19} />
            </div>

            <strong>
              EcoTrack
            </strong>

          </Link>

          <p>
            An AI-powered platform that helps
            individuals understand, track and
            reduce their carbon footprint.
          </p>

          <div className="footer-socials">

            <a
              href="https://github.com/Vansh360/Ecotrack"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github size={15} />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
            >
              <Linkedin size={15} />
            </a>

            <a
              href="mailto:contact@ecotrack.com"
              aria-label="Email"
            >
              <Mail size={15} />
            </a>

          </div>

        </div>

        {/* PRODUCT */}

        <div className="footer-column">

          <h3>
            Product
          </h3>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/goals">
            Goals
          </Link>

          <Link to="/advisor">
            AI Advisor
          </Link>

          <Link to="/leaderboard">
            Leaderboard
          </Link>

        </div>

        {/* TRACKING */}

        <div className="footer-column">

          <h3>
            Tracking
          </h3>

          <Link to="/tracking/transportation">
            Transportation
          </Link>

          <Link to="/tracking/electricity">
            Electricity
          </Link>

          <Link to="/tracking/food">
            Food
          </Link>

          <Link to="/tracking/waste">
            Waste
          </Link>

          <Link to="/tracking/water">
            Water
          </Link>

        </div>

        {/* ACCOUNT */}

        <div className="footer-column">

          <h3>
            Account
          </h3>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

          <Link to="/profile">
            Profile
          </Link>

        </div>

      </div>

      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} EcoTrack.
          All rights reserved.
        </span>

        <button
          className="footer-top-button"
          onClick={scrollTop}
        >
          Back to top
          <ArrowUp size={13} />
        </button>

      </div>

    </footer>
  );
}