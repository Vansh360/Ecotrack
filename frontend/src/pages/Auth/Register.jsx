import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Leaf, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import BrandMark from "@/components/common/BrandMark";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSession({
        token: data.token,
        user: {
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        },
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col overflow-hidden bg-card p-10 lg:flex">
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-[320px] rounded-full bg-chart-2/20 blur-3xl" />
        <BrandMark />
        <div className="relative z-10 my-auto max-w-md">
          <p className="mb-4 text-xs font-bold tracking-[0.18em] text-primary uppercase">
            Start your journey
          </p>
          <h1 className="font-display text-5xl leading-tight font-semibold">
            Small actions.{" "}
            <span className="text-primary">Measurable change.</span>
          </h1>
          <p className="mt-5 text-muted-foreground">
            Create your EcoTrack account and start understanding your environmental impact.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-2 font-display text-lg font-semibold lg:hidden">
            <Leaf size={20} className="text-primary" />
            EcoTrack
          </Link>
          <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">Get started</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Create your account</h2>
          <p className="mt-1 mb-8 text-sm text-muted-foreground">
            Start tracking your carbon footprint.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  className="pl-10"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="px-10"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <small className="text-xs text-muted-foreground">Minimum 8 characters</small>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="pl-10"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" required className="accent-primary size-4" />
              <span>I agree to the terms and privacy policy.</span>
            </label>

            {error && <Alert variant="destructive">{error}</Alert>}

            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?
            <Link to="/login" className="ml-1 font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
