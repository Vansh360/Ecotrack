import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-lg border border-input bg-card/55 px-3.5 py-2 text-sm text-foreground shadow-xs transition-all placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary/60 focus-visible:bg-card focus-visible:shadow-[0_0_0_4px_oklch(0.46_0.12_153_/_0.1)]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
