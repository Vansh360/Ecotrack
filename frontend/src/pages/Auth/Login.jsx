import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    localStorage.setItem("token", "development-token");

    // Backend will be connected later.
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
            WELCOME BACK
          </span>

          <h1>
            Continue your
            <strong>
              sustainability journey.
            </strong>
          </h1>

          <p>
            Track your impact and continue working
            toward a more sustainable lifestyle.
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
              SIGN IN
            </span>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to access your EcoTrack dashboard.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>
                Email address
              </label>

              <div className="input-box">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <div className="password-header">

                <label>
                  Password
                </label>

                <a href="#forgot">
                  Forgot password?
                </a>

              </div>

              <div className="input-box">

                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
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

            </div>

            <label className="remember">

              <input type="checkbox" />

              <span>
                Remember me
              </span>

            </label>

            <button
              type="submit"
              className="auth-submit"
            >
              Sign In
              <ArrowRight size={18} />
            </button>

          </form>

          <p className="auth-switch">
            Don't have an account?

            <Link to="/register">
              Create account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}