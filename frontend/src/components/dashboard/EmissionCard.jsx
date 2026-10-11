import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function EmissionCard({
  icon,
  title,
  value,
  percentage,
  description,
}) {
  return (
    <Card className="gap-3 px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <strong className="block text-sm">{title}</strong>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
        <strong className="font-display text-lg">{value} kg</strong>
      </div>
      <Progress value={percentage} />
      <div className="text-xs text-muted-foreground">{percentage}% of total emissions</div>
    </Card>
  );
}
