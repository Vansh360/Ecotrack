import { useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import "../Transportation/eco-visuals.css";

const COLORS = ["#1f6b4a", "#c99a2e", "#3d7ea6", "#b4472f", "#7a5ea8", "#4f8a8b"];
const MONTHLY_GOAL_KG = 120; // replace with the user's own goal from your backend
const DAY = 86400000;

// Expected shape: [{ date: "2026-10-24", category: "Food", emissions: 2.4 }, ...]
// emissions are kg CO2e. Adapt the field names if your activities use others.
const DEMO = (() => {
  const cats = ["Food", "Transport", "Electricity", "Waste"];
  const out = [];
  for (let d = 0; d < 180; d++) {
    const day = new Date(Date.now() - d * DAY).toISOString().slice(0, 10);
    cats.forEach((c, i) =>
      out.push({ date: day, category: c, emissions: +(0.3 + ((d * 7 + i * 3) % 5) * 0.25).toFixed(2) })
    );
  }
  return out;
})();

const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export default function FootprintCharts({ activities }) {
  const data = activities?.length ? activities : DEMO;
  const demo = !activities?.length;

  const { byCategory, byDay, byMonth, weekTotal, monthTotal, top } = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(Date.now() - 6 * DAY).toISOString().slice(0, 10);
    const cat = {};
    const day = {};
    const month = {};
    data.forEach((a) => {
      month[a.date.slice(0, 7)] = (month[a.date.slice(0, 7)] || 0) + a.emissions;
      day[a.date] = (day[a.date] || 0) + a.emissions;
      if (a.date >= weekStart) cat[a.category] = (cat[a.category] || 0) + a.emissions;
    });

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const key = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
      days.push({ day: new Date(key).toLocaleDateString(undefined, { weekday: "short" }), kg: +(day[key] || 0).toFixed(2) });
    }

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.toLocaleDateString(undefined, { month: "short" }),
        kg: +(month[monthKey(d)] || 0).toFixed(1),
        current: i === 0,
      });
    }

    const list = Object.entries(cat).map(([name, value]) => ({ name, value: +value.toFixed(2) }))
      .sort((a, b) => b.value - a.value);
    return {
      byCategory: list,
      byDay: days,
      byMonth: months,
      weekTotal: list.reduce((s, x) => s + x.value, 0),
      monthTotal: month[monthKey(now)] || 0,
      top: list[0],
    };
  }, [data]);

  const pct = Math.min(100, (monthTotal / MONTHLY_GOAL_KG) * 100);

  return (
    <section className="eco-card">
      <header className="eco-head">
        <div>
          <span className="eco-kicker">OVERVIEW</span>
          <h2>Your footprint</h2>
        </div>
        {demo && <span className="eco-badge">Demo data</span>}
      </header>

      <div className="eco-goal">
        <div className="eco-goal-top">
          <span>Monthly goal: {MONTHLY_GOAL_KG} kg CO₂e</span>
          <b>{monthTotal.toFixed(1)} kg used this month</b>
        </div>
        <div className="eco-goal-bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${pct}%`, background: pct > 85 ? "#b4472f" : "#1f6b4a" }} />
        </div>
      </div>

      <div className="eco-chart">
        <h3>Monthly emissions (last 6 months)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={byMonth} margin={{ left: -18, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c9d4cd" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(v) => `${v} kg CO₂e`} cursor={{ fill: "rgba(31,107,74,0.08)" }} />
            <ReferenceLine y={MONTHLY_GOAL_KG} stroke="#b4472f" strokeDasharray="5 4"
                           label={{ value: "Goal", position: "insideTopRight", fill: "#b4472f", fontSize: 12 }} />
            <Bar dataKey="kg" radius={[6, 6, 0, 0]} animationDuration={900}>
              {byMonth.map((m, i) => (
                <Cell key={i} fill={m.current ? "#1f6b4a" : "#8fbfa7"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="eco-charts">
        <div className="eco-chart">
          <h3>This week by category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}
                   paddingAngle={3} animationDuration={900}>
                {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v} kg CO₂e`} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="eco-legend">
            {byCategory.map((c, i) => (
              <li key={c.name}><i style={{ background: COLORS[i % COLORS.length] }} />{c.name} <b>{c.value} kg</b></li>
            ))}
          </ul>
        </div>

        <div className="eco-chart">
          <h3>Last 7 days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={byDay} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="ecoFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f6b4a" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#1f6b4a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c9d4cd" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => `${v} kg CO₂e`} />
              <Area type="monotone" dataKey="kg" stroke="#1f6b4a" strokeWidth={3} fill="url(#ecoFill)" animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {top && (
        <p className="eco-tip">
          💡 <b>{top.name}</b> is your biggest source this week ({Math.round((top.value / weekTotal) * 100)}%).
          Cutting it by a quarter would save about <b>{(top.value * 0.25).toFixed(1)} kg</b> CO₂e a week.
        </p>
      )}
    </section>
  );
}