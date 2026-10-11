import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Lock, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import BrandMark from "@/components/common/BrandMark";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "");
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("Login succeeded but no JWT token was returned.");
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
    } catch (error) {
      console.error("Login error:", error);

      setError(error.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col overflow-hidden bg-card p-10 lg:flex">
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-20 -right-20 size-[420px] rounded-full bg-primary/20 blur-3xl" />
        <BrandMark />
        <div className="relative z-10 my-auto max-w-md">
          <p className="mb-4 text-xs font-bold tracking-[0.18em] text-primary uppercase">
            Welcome back
          </p>
          <h1 className="font-display text-5xl leading-tight font-semibold">
            Continue your path to <span className="text-primary">measurable change.</span>
          </h1>
          <p className="mt-5 text-muted-foreground">
            Login to keep tracking emissions, goals and AI-powered insights.
          </p>
          <div className="mt-10 space-y-3 text-sm text-muted-foreground">
            {["Live carbon dashboard", "Personalised advisor", "Secure JWT session"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Check size={12} />
                </span>
                {item}
              </div>
            ))}
          </div>
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
          <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">Sign in</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Welcome back</h2>
          <p className="mt-1 mb-8 text-sm text-muted-foreground">
            Login to continue tracking your sustainability.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  className="pl-10"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}

            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Logging in..." : "Login"}
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?
            <Link to="/register" className="ml-1 font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
