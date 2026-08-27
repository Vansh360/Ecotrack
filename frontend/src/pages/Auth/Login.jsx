import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // IMPORTANT:
      // Save the real JWT returned by Spring Boot
      if (!data.token) {
        throw new Error(
          "Login succeeded but no JWT token was returned."
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      // Save basic user information
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      console.log(
        "JWT saved successfully"
      );

      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
        "Unable to login"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to continue tracking
            your sustainability.
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

      </div>

    </div>
  );
}