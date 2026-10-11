import { Code2, BriefcaseBusiness, Mail, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BrandMark from "./BrandMark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-8 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <BrandMark compact />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            An AI-powered platform that helps individuals understand, track and
            reduce their carbon footprint toward a sustainable future.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { href: "https://github.com/Vansh360/Ecotrack", label: "GitHub", icon: Code2 },
              { href: "#", label: "LinkedIn", icon: BriefcaseBusiness },
              { href: "mailto:contact@ecotrack.com", label: "Email", icon: Mail },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={item.label}
                  whileHover={{ y: -2 }}
                  className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                >
                  <Icon size={14} />
                </motion.a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[0.16em] text-foreground uppercase">
            Product
          </h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
            <Link to="/goals" className="hover:text-primary">Goals</Link>
            <Link to="/advisor" className="hover:text-primary">AI Advisor</Link>
            <Link to="/leaderboard" className="hover:text-primary">Leaderboard</Link>
            <Link to="/activities" className="hover:text-primary">Activity History</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[0.16em] text-foreground uppercase">
            Tracking
          </h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/tracking/transportation" className="hover:text-primary">Transportation</Link>
            <Link to="/tracking/electricity" className="hover:text-primary">Electricity</Link>
            <Link to="/tracking/food" className="hover:text-primary">Food</Link>
            <Link to="/tracking/waste" className="hover:text-primary">Waste</Link>
            <Link to="/tracking/water" className="hover:text-primary">Water</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[0.16em] text-foreground uppercase">
            Account
          </h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-primary">Login</Link>
            <Link to="/register" className="hover:text-primary">Register</Link>
            <Link to="/profile" className="hover:text-primary">Profile</Link>
            <Link to="/simulator" className="hover:text-primary">Simulator</Link>
            <Link to="/digital-twin" className="hover:text-primary">Digital Twin</Link>
          </div>
        </div>
      </div>

      <Separator />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} EcoTrack. All rights reserved.
        </span>
        <Button variant="outline" size="sm" onClick={scrollTop}>
          Back to top
          <ArrowUp size={12} />
        </Button>
      </div>
    </footer>
  );
}
