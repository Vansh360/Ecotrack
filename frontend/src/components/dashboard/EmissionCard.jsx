export default function EmissionCard({
  icon,
  title,
  value,
  percentage,
  description,
}) {
  return (
    <div className="emission-card">

      <div className="emission-card-header">

        <div className="emission-card-icon">
          {icon}
        </div>

        <div className="emission-card-info">
          <strong>{title}</strong>

          <span>{description}</span>
        </div>

        <strong className="emission-value">
          {value} kg
        </strong>

      </div>

      <div className="emission-progress">
        <div
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="emission-percentage">
        {percentage}% of total emissions
      </div>

    </div>
  );
}