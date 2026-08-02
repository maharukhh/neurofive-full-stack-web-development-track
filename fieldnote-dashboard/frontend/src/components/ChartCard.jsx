import './ChartCard.css'

export default function ChartCard({ title, caption, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">{title}</h3>
        {caption && <p className="chart-card__caption">{caption}</p>}
      </div>
      <div className="chart-card__body">{children}</div>
    </div>
  )
}
