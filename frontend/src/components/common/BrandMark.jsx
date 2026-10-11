import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BrandMark({ to = "/", compact = false, className }) {
  return (
    <Link to={to} className={cn("flex items-center gap-3", className)}>
      <motion.span
        whileHover={{ scale: 1.08, rotate: 6 }}
        transition={{ type: "spring", stiffness: 420, damping: 16 }}
        className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_10px_24px_oklch(0.46_0.12_153_/_0.28)]"
      >
        <Leaf size={18} />
      </motion.span>
      <span className="leading-tight">
        <span className="block font-display text-[1.05rem] font-semibold tracking-tight">
          EcoTrack
        </span>
        {!compact && (
          <span className="block text-[11px] text-muted-foreground">
            Track. Reduce. Sustain.
          </span>
        )}
      </span>
    </Link>
  );
}
