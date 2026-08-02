import './StatCards.css'

export default function StatCards({ summary }) {
  const cards = [
    { label: 'Total runs logged', value: summary.totalRuns, suffix: '' },
    { label: 'Success rate', value: summary.successRate, suffix: '%' },
    { label: 'Active teams', value: summary.activeTeams, suffix: '' },
    { label: 'Avg. run duration', value: summary.avgDurationSec, suffix: 's' },
  ]

  return (
    <div className="stat-cards">
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <span className="stat-card__value">
            {c.value}
            <span className="stat-card__suffix">{c.suffix}</span>
          </span>
          <span className="stat-card__label">{c.label}</span>
        </div>
      ))}
    </div>
  )
}
