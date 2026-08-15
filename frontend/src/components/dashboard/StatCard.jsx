export default function StatCard({
  title,
  value,
  unit,
  change,
  icon,
  positive = true,
}) {
  return (
    <div className="dashboard-stat-card">

      <div className="stat-card-top">

        <div className="stat-card-icon">
          {icon}
        </div>

        <span
          className={
            positive
              ? "stat-change positive"
              : "stat-change negative"
          }
        >
          {positive ? "↓" : "↑"} {change}
        </span>

      </div>

      <div className="stat-card-title">
        {title}
      </div>

      <div className="stat-card-value">

        {value}

        {unit && (
          <span>{unit}</span>
        )}

      </div>

    </div>
  );
}