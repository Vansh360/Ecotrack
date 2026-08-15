export default function EmissionCard({
  icon,
  title,
  value,
  percentage,
}) {
  return (
    <div className="emission-card">

      <div className="emission-card-header">

        <div className="emission-card-icon">
          {icon}
        </div>

        <div>
          <h4>{title}</h4>
          <span>Monthly emissions</span>
        </div>

      </div>

      <div className="emission-value">
        {value}
        <small>kg CO₂e</small>
      </div>

      <div className="emission-progress">

        <div
          style={{
            width: `${percentage}%`,
          }}
        ></div>

      </div>

      <div className="emission-percentage">
        {percentage}% of total emissions
      </div>

    </div>
  );
}