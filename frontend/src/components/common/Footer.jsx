import { Link } from "react-router-dom";
import { Leaf, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <Link to="/" className="logo footer-logo">

            <span className="logo-icon">
              <Leaf size={20} />
            </span>

            <span className="logo-text">
              Eco<span>Track</span>
            </span>

          </Link>

          <p>
            Track your carbon footprint, understand your impact,
            and build a more sustainable future.
          </p>

          <div className="footer-email">
            <Mail size={16} />
            <span>contact@ecotrack.com</span>
          </div>

        </div>

        <div className="footer-column">

          <h4>Platform</h4>

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <Link to="/register">
            Get Started
          </Link>

        </div>

        <div className="footer-column">

          <h4>Track</h4>

          <a href="#features">
            Transportation
          </a>

          <a href="#features">
            Electricity
          </a>

          <a href="#features">
            Food
          </a>

          <a href="#features">
            Waste
          </a>

        </div>

        <div className="footer-column">

          <h4>Company</h4>

          <a href="#about">
            About
          </a>

          <a href="#about">
            Our Mission
          </a>

          <a href="#about">
            Contact
          </a>

        </div>

      </div>

      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} EcoTrack
        </span>

        <span>
          AI-Powered Sustainability Platform
        </span>

      </div>

    </footer>
  );
}