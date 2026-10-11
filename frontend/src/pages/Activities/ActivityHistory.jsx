import { useMemo, useState } from "react";
import { Activity, Search, Trash2, Pencil, Download, CalendarDays, Leaf } from "lucide-react";
import { useActivities } from "../../context/ActivityContext";
import PageHeader from "@/components/common/PageHeader";
import Field from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ActivityHistory() {
  const { activities, updateActivity, deleteActivity } = useActivities();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [editingActivity, setEditingActivity] = useState(null);

  const getActivityDate = (activity) => {
    return activity.activityDate || activity.date || activity.createdAt || null;
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const searchText = search.toLowerCase().trim();
      const matchesSearch =
        !searchText ||
        activity.category?.toLowerCase().includes(searchText) ||
        activity.activityType?.toLowerCase().includes(searchText) ||
        activity.details?.toLowerCase().includes(searchText);

      const activityCategory = activity.category?.toUpperCase();
      const selectedCategory = category.toUpperCase();
      const matchesCategory = category === "All" || activityCategory === selectedCategory;

      let matchesDate = true;
      if (dateFilter !== "All") {
        const rawDate = getActivityDate(activity);
        if (!rawDate) {
          matchesDate = false;
        } else {
          const activityDate = new Date(rawDate);
          const today = new Date();
          if (dateFilter === "Today") {
            matchesDate = activityDate.toDateString() === today.toDateString();
          }
          if (dateFilter === "This Month") {
            matchesDate =
              activityDate.getMonth() === today.getMonth() &&
              activityDate.getFullYear() === today.getFullYear();
          }
          if (dateFilter === "This Year") {
            matchesDate = activityDate.getFullYear() === today.getFullYear();
          }
        }
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [activities, search, category, dateFilter]);

  const filteredEmission = filteredActivities.reduce(
    (total, activity) => total + Number(activity.emission || 0),
    0
  );

  const formatDate = (date) => {
    if (!date) return "Unknown";
    try {
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Unknown";
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    try {
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
      return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this activity?");
    if (confirmed) deleteActivity(id);
  };

  const exportCSV = () => {
    if (filteredActivities.length === 0) {
      alert("There are no activities to export.");
      return;
    }

    const headers = [
      "Date",
      "Category",
      "Activity",
      "Quantity",
      "Unit",
      "CO2e (kg)",
      "Emission Factor",
      "Factor Unit",
      "Region",
      "Year",
    ];

    const rows = filteredActivities.map((activity) => [
      formatDate(getActivityDate(activity)),
      activity.category || "",
      activity.activityType || activity.details || "",
      activity.quantity ?? "",
      activity.unit || "",
      Number(activity.emission || 0).toFixed(3),
      activity.emissionFactor ?? "",
      activity.emissionFactorUnit || "",
      activity.factorRegion || "",
      activity.factorYear || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ecotrack-activity-history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="EcoTrack"
        title="Activity History"
        description="View and manage your carbon footprint activities."
        actions={
          <Button variant="outline" onClick={exportCSV}>
            <Download size={15} />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Summary icon={<Activity size={19} />} label="Activities" value={filteredActivities.length} />
        <Summary icon={<Leaf size={19} />} label="Total CO₂e" value={`${filteredEmission.toFixed(2)} kg`} />
        <Summary icon={<CalendarDays size={19} />} label="Total Records" value={activities.length} />
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-2 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SelectNative value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Transportation">Transportation</option>
            <option value="Electricity">Electricity</option>
            <option value="Food">Food</option>
            <option value="Waste">Waste</option>
            <option value="Water">Water</option>
          </SelectNative>
          <SelectNative value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </SelectNative>
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center text-muted-foreground">
            <Leaf size={34} />
            <h3 className="font-display text-xl text-foreground">No activities found</h3>
            <p className="text-sm">
              Start tracking your transportation, electricity, food, waste or water usage.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>CO₂e</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => {
                const activityDate = getActivityDate(activity);
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <strong className="block text-sm">{formatDate(activityDate)}</strong>
                      {formatTime(activityDate) && (
                        <span className="text-xs text-muted-foreground">{formatTime(activityDate)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{activity.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <strong className="block text-sm">
                        {activity.activityType || activity.details || "Activity"}
                      </strong>
                      {activity.details && (
                        <span className="text-xs text-muted-foreground">{activity.details}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {activity.quantity !== undefined
                        ? `${activity.quantity} ${activity.unit || ""}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <strong>{Number(activity.emission || 0).toFixed(2)} kg</strong>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          title="Edit"
                          onClick={() => setEditingActivity(activity)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Delete"
                          onClick={() => handleDelete(activity.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {editingActivity && (
        <EditActivityModal
          activity={editingActivity}
          onClose={() => setEditingActivity(null)}
          onSave={(updatedActivity) => {
            updateActivity(editingActivity.id, updatedActivity);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
}

function Summary({ icon, label, value }) {
  return (
    <Card className="flex-row items-center gap-4 px-5 py-4">
      <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <span className="text-xs text-muted-foreground">{label}</span>
        <strong className="block font-display text-xl">{value}</strong>
      </div>
    </Card>
  );
}

function EditActivityModal({ activity, onClose, onSave }) {
  const [quantity, setQuantity] = useState(activity.quantity ?? "");
  const [emission, setEmission] = useState(activity.emission ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity === "" || Number(quantity) < 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (emission === "" || Number(emission) < 0) {
      alert("Please enter a valid emission.");
      return;
    }
    onSave({
      quantity: Number(quantity),
      emission: Number(emission),
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>Edit activity</DialogDescription>
          <DialogTitle>{activity.category}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Activity">
            <Input value={activity.activityType || activity.details || ""} disabled />
          </Field>
          <Field label="Quantity">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Field>
          <Field label="CO₂e (kg)">
            <Input
              type="number"
              min="0"
              step="0.001"
              value={emission}
              onChange={(e) => setEmission(e.target.value)}
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
