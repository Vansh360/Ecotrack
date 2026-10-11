import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StatCard({
  icon,
  title,
  value,
  unit,
  description,
  trend,
}) {
  return (
    <Card className="gap-3 px-5 py-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          {icon}
        </div>
        {trend && <Badge variant="secondary">{trend}</Badge>}
      </div>
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </span>
      <div className="font-display text-3xl font-semibold tracking-tight">
        {value}
        {unit && <small className="ml-1 text-sm font-sans font-medium text-muted-foreground">{unit}</small>}
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </Card>
  );
}
