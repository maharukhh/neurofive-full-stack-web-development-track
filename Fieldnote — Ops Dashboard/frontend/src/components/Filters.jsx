import './Filters.css'

export default function Filters({ meta, filters, onChange }) {
  if (!meta) return null;

  return (
    <div className="filters">
      <div className="filters__field">
        <label htmlFor="from">From</label>
        <input
          type="date"
          id="from"
          min={meta.dateRange.min}
          max={meta.dateRange.max}
          value={filters.from}
          onChange={(e) => onChange({ ...filters, from: e.target.value })}
        />
      </div>

      <div className="filters__field">
        <label htmlFor="to">To</label>
        <input
          type="date"
          id="to"
          min={meta.dateRange.min}
          max={meta.dateRange.max}
          value={filters.to}
          onChange={(e) => onChange({ ...filters, to: e.target.value })}
        />
      </div>

      <div className="filters__field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          {meta.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filters__field">
        <label htmlFor="team">Team</label>
        <select
          id="team"
          value={filters.team}
          onChange={(e) => onChange({ ...filters, team: e.target.value })}
        >
          {meta.teams.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
