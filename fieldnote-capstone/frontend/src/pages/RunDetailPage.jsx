import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import * as api from '../api'
import { useAuth } from '../context/AuthContext'
import './RunDetailPage.css'

const CATEGORIES = ['Robotics', 'Computer Vision', 'Automation']
const STATUSES = ['nominal', 'watch', 'failed']

export default function RunDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [run, setRun] = useState(null)
  const [status, setStatus] = useState('loading')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saveStatus, setSaveStatus] = useState('idle')

  useEffect(() => {
    api
      .fetchRun(id)
      .then((data) => {
        setRun(data.run)
        setForm({
          team_id: data.run.team_id,
          title: data.run.title,
          category: data.run.category,
          status: data.run.status,
          duration_sec: data.run.duration_sec,
          notes: data.run.notes || '',
        })
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [id])

  const canModify = user && run && (user.role === 'admin' || user.id === run.created_by);

  function validate() {
    const errors = {}
    if (!form.title || form.title.trim().length < 2) errors.title = 'Title must be at least 2 characters'
    if (!form.duration_sec || Number(form.duration_sec) <= 0) errors.duration_sec = 'Enter a positive duration'
    return errors
  }

  async function handleSave(e) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    setSaveStatus('saving')
    try {
      const data = await api.updateRun(id, { ...form, duration_sec: Number(form.duration_sec) })
      setRun(data.run)
      setEditing(false)
      setSaveStatus('idle')
    } catch (err) {
      setSaveStatus('idle')
      setFieldErrors(err.fieldErrors || {})
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this run permanently?')) return
    await api.deleteRun(id)
    navigate('/runs')
  }

  if (status === 'loading') return <div className="container"><p className="state-banner">Loading run…</p></div>
  if (status === 'error') return <div className="container"><p className="state-banner state-banner--error">Run not found.</p></div>

  return (
    <div className="container run-detail">
      <Link to="/runs" className="run-detail__back">← Back to runs</Link>

      {!editing ? (
        <div className="card run-detail__view">
          <div className="run-detail__header">
            <h1>{run.title}</h1>
            <span className={`status-pill status-pill--${run.status}`}>{run.status}</span>
          </div>
          <dl className="run-detail__meta">
            <div><dt>Team</dt><dd>{run.team_name}</dd></div>
            <div><dt>Category</dt><dd>{run.category}</dd></div>
            <div><dt>Duration</dt><dd>{run.duration_sec}s</dd></div>
            <div><dt>Logged by</dt><dd>{run.owner_name}</dd></div>
          </dl>
          {run.notes && <p className="run-detail__notes">{run.notes}</p>}
          {canModify && (
            <div className="run-detail__actions">
              <button className="btn btn-ghost" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      ) : (
        <form className="card run-detail__form" onSubmit={handleSave} noValidate>
          <div className="field">
            <label htmlFor="edit-title">Title</label>
            <input id="edit-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          </div>
          <div className="field">
            <label htmlFor="edit-category">Category</label>
            <select id="edit-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="edit-status">Status</label>
            <select id="edit-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="edit-duration">Duration (sec)</label>
            <input
              id="edit-duration"
              type="number"
              min="1"
              value={form.duration_sec}
              onChange={(e) => setForm({ ...form, duration_sec: e.target.value })}
            />
            {fieldErrors.duration_sec && <span className="field-error">{fieldErrors.duration_sec}</span>}
          </div>
          <div className="field">
            <label htmlFor="edit-notes">Notes</label>
            <textarea id="edit-notes" rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="run-detail__actions">
            <button className="btn btn-primary" type="submit" disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
