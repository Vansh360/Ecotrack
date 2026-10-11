import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  BarChart3,
  Car,
  Droplets,
  Leaf,
  Recycle,
  Target,
  Utensils,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getActivities } from "../../services/activityService";
import {
  getCarbonHotspot,
  getCarbonBudgetStatus,
  getScoreLabel,
} from "../../utils/sustainabilityEngine";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/dashboard/StatCard";

const categoryIcons = {
  TRANSPORTATION: Car,
  ELECTRICITY: Zap,
  FOOD: Utensils,
  WASTE: Recycle,
  WATER: Droplets,
};

const categoryNames = {
  TRANSPORTATION: "Transportation",
  ELECTRICITY: "Electricity",
  FOOD: "Food",
  WASTE: "Waste",
  WATER: "Water",
};

const pieColors = [
  "oklch(0.88 0.19 128)",
  "oklch(0.76 0.1 185)",
  "oklch(0.78 0.12 85)",
  "oklch(0.7 0.08 230)",
  "oklch(0.82 0.08 145)",
];

function getCategoryIcon(category) {
  const normalized = String(category || "").trim().toUpperCase();
  return categoryIcons[normalized] || Leaf;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      setLoading(true);
      setError("");
      const result = await getActivities();
      console.log("Dashboard activities:", result);
      setActivities(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Dashboard activity error:", err);
      if (err?.status === 401 || err?.status === 403) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(err.message || "Unable to load activities.");
      }
    } finally {
      setLoading(false);
    }
  }

  const getMonthKey = (date) => {
    if (!date) return null;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return null;
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
  };

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthKey = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthEmission = useMemo(() => {
    return activities
      .filter((activity) => {
        const date = activity.activityDate || activity.date || activity.createdAt;
        return getMonthKey(date) === currentMonthKey;
      })
      .reduce((total, activity) => total + Number(activity.emission || 0), 0);
  }, [activities, currentMonthKey]);

  const previousMonthEmission = useMemo(() => {
    return activities
      .filter((activity) => {
        const date = activity.activityDate || activity.date || activity.createdAt;
        return getMonthKey(date) === previousMonthKey;
      })
      .reduce((total, activity) => total + Number(activity.emission || 0), 0);
  }, [activities, previousMonthKey]);

  const co2Reduced = useMemo(() => {
    if (previousMonthEmission <= 0) return 0;
    return Math.max(previousMonthEmission - currentMonthEmission, 0);
  }, [previousMonthEmission, currentMonthEmission]);

  const co2Change = useMemo(() => {
    if (previousMonthEmission <= 0) {
      return { direction: "same", percentage: 0 };
    }
    const percentage = Math.abs(
      ((currentMonthEmission - previousMonthEmission) / previousMonthEmission) * 100
    );
    if (currentMonthEmission < previousMonthEmission) {
      return { direction: "down", percentage: Number(percentage.toFixed(1)) };
    }
    if (currentMonthEmission > previousMonthEmission) {
      return { direction: "up", percentage: Number(percentage.toFixed(1)) };
    }
    return { direction: "same", percentage: 0 };
  }, [currentMonthEmission, previousMonthEmission]);

  const totalEmission = currentMonthEmission;

  const categoryBreakdown = useMemo(() => {
    const result = {};
    activities.forEach((activity) => {
      const category = String(activity.category || "OTHER").trim().toUpperCase();
      const emission = Number(activity.emission || 0);
      result[category] = (result[category] || 0) + emission;
    });
    const total = Object.values(result).reduce((sum, value) => sum + value, 0);
    return Object.entries(result).map(([category, emission]) => ({
      category,
      emission,
      percentage: total ? Math.round((emission / total) * 100) : 0,
    }));
  }, [activities]);

  const monthlyEmissions = useMemo(() => {
    const result = {};
    activities.forEach((activity) => {
      const date = activity.activityDate || activity.date || activity.createdAt;
      if (!date) return;
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return;
      const month = parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      result[month] = (result[month] || 0) + Number(activity.emission || 0);
    });
    return Object.entries(result).map(([month, emission]) => ({
      month,
      emission: Number(emission.toFixed(2)),
    }));
  }, [activities]);

  const sustainabilityScore =
    activities.length === 0
      ? 100
      : Math.max(0, Math.min(100, Math.round(100 - totalEmission * 2)));

  const carbonHotspot = getCarbonHotspot(activities);
  const carbonBudget = getCarbonBudgetStatus(totalEmission, 250);
  const scoreLabel = getScoreLabel(sustainabilityScore);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Loading your EcoTrack data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-display text-2xl">Unable to load dashboard</h2>
        <p className="max-w-md text-muted-foreground">{error}</p>
        <Button onClick={loadActivities}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Overview"
        title="Sustainability Dashboard"
        description="Track your environmental impact and improve your sustainability."
        actions={
          <>
            <div className="text-right">
              <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Current Month
              </span>
              <strong className="text-sm">
                {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </strong>
            </div>
            <Button onClick={() => navigate("/activity/add")}>+ Add Activity</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Leaf size={19} />}
          title="Carbon Footprint"
          value={totalEmission.toFixed(2)}
          unit="kg CO₂e"
          description="This month"
        />
        <StatCard
          icon={<Target size={19} />}
          title="Sustainability Score"
          value={sustainabilityScore}
          unit="/100"
          description={scoreLabel}
        />
        <StatCard
          icon={<Activity size={19} />}
          title="Total Activities"
          value={activities.length}
          unit="records"
          description="Recorded activities"
        />
        <StatCard
          icon={<ArrowDownRight size={19} />}
          title="CO₂ Reduced"
          value={co2Reduced.toFixed(2)}
          unit="kg"
          description={
            co2Change.direction === "down"
              ? `${co2Change.percentage}% lower than last month`
              : co2Change.direction === "up"
                ? `${co2Change.percentage}% higher than last month`
                : "Same as last month"
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Emissions</CardTitle>
            <CardDescription>Monthly CO₂e emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              {monthlyEmissions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyEmissions}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`${value} kg CO₂e`, "Emission"]} />
                    <Line
                      type="monotone"
                      dataKey="emission"
                      stroke="oklch(0.88 0.19 128)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emission Sources</CardTitle>
            <CardDescription>Where your emissions come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {categoryBreakdown.some((item) => item.emission > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown.filter((item) => item.emission > 0)}
                      dataKey="emission"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={55}
                    >
                      {categoryBreakdown
                        .filter((item) => item.emission > 0)
                        .map((item, index) => (
                          <Cell key={item.category} fill={pieColors[index % 5]} />
                        ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {categoryBreakdown.map((item) => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <div
                    className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2"
                    key={item.category}
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon size={15} />
                      <span>{categoryNames[item.category] || item.category}</span>
                    </div>
                    <div className="text-sm">
                      <strong>{item.emission.toFixed(2)} kg</strong>
                      <span className="ml-1 text-muted-foreground">({item.percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Hotspot</CardTitle>
            <CardDescription>Your highest emission source</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="font-display text-2xl">{carbonHotspot.category}</h3>
            <strong className="mt-1 block text-primary">{carbonHotspot.emission} kg CO₂e</strong>
            <p className="mt-2 text-sm text-muted-foreground">
              {carbonHotspot.percentage}% of your total emissions
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Focus on reducing this category first for the biggest potential impact.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carbon Budget</CardTitle>
            <CardDescription>Monthly personal target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl">
              <strong>{carbonBudget.used}</strong>
              {" / "}
              {carbonBudget.budget}
              {" kg CO₂e"}
            </div>
            <Progress
              className="mt-4 h-3"
              value={Math.min(carbonBudget.percentage, 100)}
              indicatorClassName={
                carbonBudget.status === "exceeded"
                  ? "bg-destructive"
                  : carbonBudget.status === "warning"
                    ? "bg-amber-400"
                    : "bg-primary"
              }
              aria-label="Monthly carbon budget used"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              {carbonBudget.status === "exceeded"
                ? "Monthly carbon budget exceeded."
                : carbonBudget.status === "warning"
                  ? "You are approaching your carbon budget."
                  : `${carbonBudget.remaining} kg CO₂e remaining.`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-primary uppercase">Tracking</p>
        <h2 className="font-display text-2xl font-semibold">This Month by Category</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {categoryBreakdown.map((item) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <Card key={item.category} className="gap-2 px-5 py-5 transition-transform hover:-translate-y-1">
              <div className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <span className="text-xs text-muted-foreground">
                {categoryNames[item.category] || item.category}
              </span>
              <strong className="font-display text-xl">{item.emission.toFixed(2)} kg</strong>
              <small className="text-xs text-muted-foreground">{item.percentage}% of total emissions</small>
            </Card>
          );
        })}
      </div>

      {activities.length > 0 && (
        <>
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-primary uppercase">Activity</p>
            <h2 className="font-display text-2xl font-semibold">Recent Activities</h2>
          </div>
          <div className="flex flex-col gap-2">
            {activities.map((activity) => {
              const Icon = getCategoryIcon(activity.category);
              return (
                <Card key={activity.id} className="flex-row items-center gap-4 px-4 py-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <strong className="block text-sm">
                      {activity.activityType || activity.category}
                    </strong>
                    <span className="text-xs text-muted-foreground">
                      {categoryNames[String(activity.category || "").toUpperCase()] || activity.category}
                      {" • "}
                      {activity.quantity} {activity.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="font-display">
                      {Number(activity.emission || 0).toFixed(2)} kg
                    </strong>
                    <span className="block text-[11px] text-muted-foreground">CO₂e</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {activities.length === 0 && (
        <Card className="items-center gap-3 border-dashed px-8 py-16 text-center">
          <Leaf size={32} className="text-primary" />
          <h3 className="font-display text-xl">Start tracking your footprint</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Add transportation, electricity, food, waste or water activities
            to see your real carbon footprint.
          </p>
        </Card>
      )}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <BarChart3 size={32} />
      <span className="text-sm">No activity data yet</span>
    </div>
  );
}
