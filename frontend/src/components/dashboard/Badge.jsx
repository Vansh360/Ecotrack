import { Card } from "@/components/ui/card";

export default function Badge({ icon, title, description }) {
  return (
    <Card className="flex-row items-center gap-4 px-5 py-4">
      <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <strong className="block text-sm">{title}</strong>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </Card>
  );
}
