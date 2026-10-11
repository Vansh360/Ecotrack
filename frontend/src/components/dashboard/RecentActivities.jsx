import { Car, Zap, Utensils, Recycle, Droplets, Leaf } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const icons = {
  Transportation: Car,
  Electricity: Zap,
  Food: Utensils,
  Waste: Recycle,
  Water: Droplets,
};

export default function RecentActivities({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <Card className="px-6 py-8 text-center text-muted-foreground">
        <h2 className="font-display text-lg text-foreground">Recent Activities</h2>
        <p className="mt-2 text-sm">No activities added yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your latest environmental activities</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {activities.map((activity) => {
          const Icon = icons[activity.category] || Leaf;
          return (
            <div
              className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3"
              key={activity.id}
            >
              <div className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <strong className="block text-sm">
                  {activity.activityType || activity.category}
                </strong>
                <span className="text-xs text-muted-foreground">
                  {activity.category} • {activity.quantity} {activity.unit}
                </span>
              </div>
              <div className="text-right">
                <strong className="font-display text-base">
                  {Number(activity.emission || 0).toFixed(2)} kg
                </strong>
                <span className="block text-[11px] text-muted-foreground">CO₂e</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
