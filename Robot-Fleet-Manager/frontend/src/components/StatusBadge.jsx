const LABELS = {
  idle: "Idle",
  active: "Active",
  charging: "Charging",
  error: "Error",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      {LABELS[status] || status}
    </span>
  );
}
