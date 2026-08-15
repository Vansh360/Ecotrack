import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">
            <Leaf size={21} />
          </span>

          <span className="logo-text">
            Eco<span>Track</span>
          </span>
        </Link>

        <nav className={open ? "nav-links nav-open" : "nav-links"}>

          <a href="#home" onClick={closeMenu}>
            Home
          </a>

          <a href="#how-it-works" onClick={closeMenu}>
            How It Works
          </a>

          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#about" onClick={closeMenu}>
            About
          </a>

          <div className="mobile-nav-buttons">
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>

            <Link to="/register" onClick={closeMenu}>
              Get Started
            </Link>
          </div>

        </nav>

        <div className="desktop-nav-buttons">

          <Link to="/login" className="login-button">
            Login
          </Link>

          <Link to="/register" className="get-started-button">
            Get Started
          </Link>

        </div>

        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>

      </div>
    </header>
  );
}