import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  User,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log(form);

    // Backend registration will be connected later.
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      <div className="auth-brand-side">

        <Link to="/" className="auth-logo">

          <span className="logo-icon">
            <Leaf size={22} />
          </span>

          <span>
            Eco<span>Track</span>
          </span>

        </Link>

        <div className="auth-message">

          <span>
            START YOUR JOURNEY
          </span>

          <h1>
            Small actions.
            <strong>
              Measurable change.
            </strong>
          </h1>

          <p>
            Create your EcoTrack account and start
            understanding your environmental impact.
          </p>

        </div>

      </div>

      <div className="auth-form-side">

        <div className="auth-form-container">

          <Link to="/" className="mobile-auth-logo">
            <Leaf size={22} />
            EcoTrack
          </Link>

          <div className="auth-heading">

            <span className="section-label">
              GET STARTED
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Start tracking your carbon footprint.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>
                Full name
              </label>

              <div className="input-box">

                <User size={18} />

                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Email address
              </label>

              <div className="input-box">

                <Mail size={18} />

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Password
              </label>

              <div className="input-box">

                <Lock size={18} />

                <input
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

              <small>
                Minimum 8 characters
              </small>

            </div>

            <div className="form-group">

              <label>
                Confirm password
              </label>

              <div className="input-box">

                <Lock size={18} />

                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <label className="terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the terms and privacy policy.
              </span>

            </label>

            <button
              type="submit"
              className="auth-submit"
            >
              Create Account
              <ArrowRight size={18} />
            </button>

          </form>

          <p className="auth-switch">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}