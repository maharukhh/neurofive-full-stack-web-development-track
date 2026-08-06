import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import './ListPages.css'

const CATEGORIES = ['Robotics', 'Computer Vision', 'Automation']
const STATUSES = ['nominal', 'watch', 'failed']

export default function RunsPage() {
  const [teams, setTeams] = useState([])
  const [runs, setRuns] = useState(null)
  const [status, setStatus] = useState('loading')
  const [filters, setFilters] = useState({ q: '', team_id: '', category: '', status: '' })

  const [form, setForm] = useState({ team_id: '', title: '', category: '', duration_sec: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formStatus, setFormStatus] = useState('idle')

  useEffect(() => {
    api.fetchTeams().then((data) => setTeams(data.teams)).catch(() => {})
  }, [])

  const loadRuns = useCallback((f) => {
    setStatus('loading')
    api
      .fetchRuns(f)
      .then((data) => {
        setRuns(data.runs)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => { loadRuns(filters) }, [filters, loadRuns])

  function validate() {
    const errors = {}
    if (!form.team_id) errors.team_id = 'Select a team'
    if (!form.title || form.title.trim().length < 2) errors.title = 'Title must be at least 2 characters'
    if (!form.category) errors.category = 'Select a category'
    if (!form.duration_sec || Number(form.duration_sec) <= 0) errors.duration_sec = 'Enter a positive duration'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    setFormStatus('saving')
    try {
      await api.createRun({ ...form, duration_sec: Number(form.duration_sec) })
      setForm({ team_id: '', title: '', category: '', duration_sec: '' })
      setFormStatus('idle')
      loadRuns(filters)
    } catch (err) {
      setFormStatus('idle')
      setFieldErrors(err.fieldErrors || {})
    }
  }

  return (
    <div className="container list-page">
      <h1>Runs</h1>

      <form className="card list-page__form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="run-team">Team</label>
          <select id="run-team" value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })}>
            <option value="">Select a team…</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {fieldErrors.team_id && <span className="field-error">{fieldErrors.team_id}</span>}
        </div>
        <div className="field">
          <label htmlFor="run-title">Title</label>
          <input id="run-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
        </div>
        <div className="field">
          <label htmlFor="run-category">Category</label>
          <select id="run-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
        </div>
        <div className="field">
          <label htmlFor="run-duration">Duration (sec)</label>
          <input
            id="run-duration"
            type="number"
            min="1"
            value={form.duration_sec}
            onChange={(e) => setForm({ ...form, duration_sec: e.target.value })}
          />
          {fieldErrors.duration_sec && <span className="field-error">{fieldErrors.duration_sec}</span>}
        </div>
        <div className="list-page__form-actions">
          <button className="btn btn-primary" type="submit" disabled={formStatus === 'saving'}>
            {formStatus === 'saving' ? 'Logging…' : 'Log run'}
          </button>
        </div>
      </form>

      <div className="list-page__filters">
        <input
          placeholder="Search titles…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <select value={filters.team_id} onChange={(e) => setFilters({ ...filters, team_id: e.target.value })}>
          <option value="">All teams</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {status === 'loading' && <p className="state-banner">Loading runs…</p>}
      {status === 'error' && <p className="state-banner state-banner--error">Couldn't load runs. Try refreshing.</p>}
      {status === 'ready' && runs.length === 0 && (
        <p className="state-banner state-banner--empty">No runs match these filters.</p>
      )}

      {status === 'ready' && runs.length > 0 && (
        <div className="list-page__grid">
          {runs.map((run) => (
            <div className="card run-card" key={run.id}>
              <div className="run-card__header">
                <Link to={`/runs/${run.id}`} className="run-card__title">{run.title}</Link>
                <span className={`status-pill status-pill--${run.status}`}>{run.status}</span>
              </div>
              <span className="run-card__meta">{run.team_name} · {run.category} · {run.duration_sec}s</span>
              <span className="run-card__meta">logged by {run.owner_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
