import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  Car,
  Zap,
  Utensils,
  Recycle,
  Droplets,
  Target,
  ArrowRight,
  Brain,
  ShieldCheck,
  Trophy,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import BrandMark from "../common/BrandMark";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../../context/AuthContext";

const navGroups = [
  {
    title: null,
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/activities", icon: Activity, label: "Activity History" },
    ],
  },
  {
    title: "Track",
    items: [
      { to: "/tracking/transportation", icon: Car, label: "Transportation" },
      { to: "/tracking/electricity", icon: Zap, label: "Electricity" },
      { to: "/tracking/food", icon: Utensils, label: "Food" },
      { to: "/tracking/waste", icon: Recycle, label: "Waste" },
      { to: "/tracking/water", icon: Droplets, label: "Water" },
    ],
  },
  {
    title: "Improve",
    items: [
      { to: "/goals", icon: Target, label: "Goals" },
      { to: "/digital-twin", icon: Brain, label: "Carbon Digital Twin" },
      { to: "/anomaly-detector", icon: ShieldCheck, label: "Anomaly Detector" },
      { to: "/simulator", icon: ArrowRight, label: "Carbon Simulator" },
      { to: "/advisor", icon: Sparkles, label: "AI Advisor" },
    ],
  },
  {
    title: "Community",
    items: [
      { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
      { to: "/profile", icon: User, label: "Profile" },
    ],
  },
];

export default function Sidebar({ isOpen = true, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[274px] flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-xl transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between px-6 py-6">
        <BrandMark compact />
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <ChevronLeft size={18} />
          </Button>
        )}
      </div>
      <Separator />

      <div className="px-6 pb-4 text-[10px] font-bold tracking-[0.22em] text-sidebar-foreground/50 uppercase">
        Personal climate studio
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-2">
            {group.title && (
              <div className="flex items-center gap-3 px-3 pt-5 pb-2 text-[10px] font-bold tracking-[0.2em] text-sidebar-foreground/40 uppercase">
                <span>{String(gi).padStart(2, "0")} / {group.title}</span>
                <span className="h-px flex-1 bg-sidebar-border" />
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/65 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive && "bg-sidebar-accent text-sidebar-foreground shadow-[inset_3px_0_0_var(--sidebar-primary)]"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent/60 text-sidebar-foreground/60 transition-colors group-hover:bg-sidebar-primary/15 group-hover:text-sidebar-primary">
                        <Icon size={15} />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight size={14} className="text-sidebar-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:text-sidebar-foreground/45" />
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute right-0 h-5 w-1 rounded-l-full bg-primary"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4">
        <Separator className="mb-4 bg-sidebar-border" />
        <div className="mb-3 rounded-xl border border-sidebar-border bg-sidebar-accent/60 px-3 py-3">
          <p className="text-[10px] font-bold tracking-[0.16em] text-sidebar-foreground/45 uppercase">Your north star</p>
          <p className="mt-1 text-xs leading-relaxed text-sidebar-foreground/75">Small, consistent choices add up.</p>
        </div>
        <Button
          variant="ghost"
          className="logout-button w-full justify-start text-sidebar-foreground/60"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
