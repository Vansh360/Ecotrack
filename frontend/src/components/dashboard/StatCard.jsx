export default function StatCard({
  icon,
  title,
  value,
  unit,
  description,
  trend,
}) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <div className="stat-card-icon">
          {icon}
        </div>

        {trend && (
          <span className="stat-trend">
            {trend}
          </span>
        )}

      </div>

      <span className="stat-card-title">
        {title}
      </span>

      <div className="stat-card-value">
        {value}

        {unit && (
          <small>{unit}</small>
        )}
      </div>

      {description && (
        <p>{description}</p>
      )}

    </div>
  );
}