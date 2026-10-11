import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full rounded-lg border border-input bg-card/55 px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-all placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary/60 focus-visible:bg-card focus-visible:shadow-[0_0_0_4px_oklch(0.46_0.12_153_/_0.1)]",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
