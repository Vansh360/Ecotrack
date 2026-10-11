import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Target,
  Sparkles,
  Trophy,
} from "lucide-react";
import BrandMark from "./BrandMark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/advisor", label: "AI Advisor", icon: Sparkles },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex h-[78px] items-center justify-between px-5 transition-all md:px-10",
          "border-b border-transparent backdrop-blur-xl",
          scrolled && "border-border/70 bg-background/80 shadow-[0_12px_40px_-25px_oklch(0.22_0.035_155_/_0.45)]"
        )}
      >
        <BrandMark />

        <div className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-primary/10 text-primary"
                )}
              >
                {Icon && <Icon size={14} />}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <Button variant="outline" onClick={() => navigate("/login")}>
            <LogIn size={14} />
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>
            <UserPlus size={14} />
            Get Started
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="xl:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[78px] z-40 border-b border-border bg-background/95 p-4 backdrop-blur-xl xl:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-muted-foreground",
                      location.pathname === link.to && "bg-primary/10 text-primary"
                    )}
                  >
                    {Icon && <Icon size={14} />}
                    {link.label}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-border" />
              <Link to="/login" onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm">
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-lg border border-primary/30 px-4 py-3 text-center text-sm font-semibold text-primary"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
