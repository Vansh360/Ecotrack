import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Field({ label, htmlFor, hint, icon: Icon, className, children }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label htmlFor={htmlFor} className="flex items-center gap-2">
          {Icon && <Icon size={14} />}
          {label}
        </Label>
      )}
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
