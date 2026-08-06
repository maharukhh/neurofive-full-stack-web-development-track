import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import * as api from '../api'
import './DashboardPage.css'

const PIE_COLORS = { nominal: '#3b6e52', watch: '#c97a2e', failed: '#c9463c' }

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api
      .fetchDashboard()
      .then((d) => {
        setData(d)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'loading') return <div className="container"><p className="state-banner">Loading dashboard…</p></div>
  if (status === 'error') return <div className="container"><p className="state-banner state-banner--error">Couldn't load dashboard data.</p></div>

  const { summary, categoryBreakdown, statusBreakdown, byTeam } = data
  const isEmpty = summary.totalRuns === 0

  return (
    <div className="container dashboard-page">
      <h1>Dashboard</h1>

      <div className="stat-cards">
        <div className="card stat-card"><span className="stat-card__value">{summary.totalRuns}</span><span className="stat-card__label">Total runs</span></div>
        <div className="card stat-card"><span className="stat-card__value">{summary.successRate}%</span><span className="stat-card__label">Success rate</span></div>
        <div className="card stat-card"><span className="stat-card__value">{summary.activeTeams}</span><span className="stat-card__label">Active teams</span></div>
        <div className="card stat-card"><span className="stat-card__value">{summary.avgDurationSec}s</span><span className="stat-card__label">Avg. duration</span></div>
      </div>

      {isEmpty ? (
        <p className="state-banner state-banner--empty">No runs logged yet — add a team and log a run to see charts here.</p>
      ) : (
        <div className="dashboard-page__charts">
          <div className="card chart-card">
            <h3>Runs by team</h3>
            <div className="chart-card__body">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byTeam} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(15,21,18,0.06)" vertical={false} />
                  <XAxis dataKey="team" tick={{ fontSize: 11, fill: '#55625b' }} axisLine={{ stroke: 'rgba(15,21,18,0.12)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#55625b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12 }} />
                  <Bar dataKey="count" fill="#3b6e52" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <h3>Status breakdown</h3>
            <div className="chart-card__body">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
                    {statusBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#9aa79c'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12 }} />
                  <Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <h3>Category breakdown</h3>
            <div className="chart-card__body">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(15,21,18,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#55625b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#55625b' }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12 }} />
                  <Bar dataKey="value" fill="#c97a2e" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
