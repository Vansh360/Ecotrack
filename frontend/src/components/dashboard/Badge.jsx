export default function Badge({ icon, title, description }) {
  return (
    <div className="badge-card">
      <div className="badge-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}