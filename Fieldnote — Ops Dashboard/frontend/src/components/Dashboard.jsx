import { useState, useEffect, useCallback } from 'react'
import { fetchMeta, fetchDashboard } from '../api'
import Filters from './Filters'
import StatCards from './StatCards'
import RunsBarChart from './RunsBarChart'
import SuccessLineChart from './SuccessLineChart'
import CategoryDonutChart from './CategoryDonutChart'
import './Dashboard.css'

const DEFAULT_FILTERS = { from: '', to: '', category: 'All', team: 'All' }

export default function Dashboard() {
  const [meta, setMeta] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  // Load filter option lists + set default date range once, on mount
  useEffect(() => {
    fetchMeta()
      .then((m) => {
        setMeta(m)
        setFilters((f) => ({ ...f, from: m.dateRange.min, to: m.dateRange.max }))
      })
      .catch(() => setStatus('error'))
  }, [])

  const loadDashboard = useCallback((f) => {
    setStatus('loading')
    fetchDashboard(f)
      .then((d) => {
        setData(d)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  // Refetch whenever filters change (and once meta has set the initial dates)
  useEffect(() => {
    if (filters.from && filters.to) loadDashboard(filters)
  }, [filters, loadDashboard])

  if (status === 'error') {
    return (
      <div className="container dash-state">
        <p>
          Couldn't reach the dashboard API. Make sure the backend is running at{' '}
          <code>http://localhost:4000</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="container dash-content">
      <Filters meta={meta} filters={filters} onChange={setFilters} />

      {status === 'loading' && !data && <div className="dash-state">Loading run data…</div>}

      {data && (
        <>
          <StatCards summary={data.summary} />
          <div className="chart-grid">
            <RunsBarChart data={data.runsByWeek} />
            <SuccessLineChart data={data.successTrend} />
            <CategoryDonutChart data={data.categoryBreakdown} />
          </div>
          {data.summary.totalRuns === 0 && (
            <p className="dash-empty">No runs match these filters — try widening the date range.</p>
          )}
        </>
      )}
    </div>
  )
}
