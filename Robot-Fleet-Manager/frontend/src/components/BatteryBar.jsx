const SEGMENTS = 10;

export default function BatteryBar({ value }) {
  const filled = Math.round((value / 100) * SEGMENTS);
  const level = value <= 15 ? "low" : value <= 40 ? "mid" : "high";

  return (
    <div className="battery" title={`${value}%`}>
      <div className="battery__cells">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className={`battery__cell ${i < filled ? `battery__cell--${level}` : ""}`}
          />
        ))}
      </div>
      <span className="battery__label">{value}%</span>
    </div>
  );
}
