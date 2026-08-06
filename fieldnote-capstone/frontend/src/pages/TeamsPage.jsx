import { useState, useEffect, useCallback } from 'react'
import * as api from '../api'
import { useAuth } from '../context/AuthContext'
import './ListPages.css'

export default function TeamsPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formStatus, setFormStatus] = useState('idle')

  const load = useCallback(() => {
    setStatus('loading')
    api
      .fetchTeams()
      .then((data) => {
        setTeams(data.teams)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => { load() }, [load])

  function validate() {
    const errors = {}
    if (!form.name || form.name.trim().length < 2) errors.name = 'Team name must be at least 2 characters'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    setFormStatus('saving')
    try {
      if (editingId) {
        await api.updateTeam(editingId, form)
      } else {
        await api.createTeam(form)
      }
      setForm({ name: '', description: '' })
      setEditingId(null)
      setFormStatus('idle')
      load()
    } catch (err) {
      setFormStatus('idle')
      setFieldErrors(err.fieldErrors || { name: err.message })
    }
  }

  function startEdit(team) {
    setEditingId(team.id)
    setForm({ name: team.name, description: team.description || '' })
  }

  async function handleDelete(id) {
    if (!confirm('Delete this team? Its runs will be deleted too.')) return
    await api.deleteTeam(id)
    load()
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="container list-page">
      <h1>Teams</h1>

      {isAdmin && (
        <form className="card list-page__form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="team-name">Team name</label>
            <input
              id="team-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="team-desc">Description</label>
            <input
              id="team-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="list-page__form-actions">
            <button className="btn btn-primary" type="submit" disabled={formStatus === 'saving'}>
              {formStatus === 'saving' ? 'Saving…' : editingId ? 'Update team' : 'Add team'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { setEditingId(null); setForm({ name: '', description: '' }) }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {status === 'loading' && <p className="state-banner">Loading teams…</p>}
      {status === 'error' && <p className="state-banner state-banner--error">Couldn't load teams. Try refreshing.</p>}
      {status === 'ready' && teams.length === 0 && (
        <p className="state-banner state-banner--empty">No teams yet{isAdmin ? ' — add one above.' : '.'}</p>
      )}

      {status === 'ready' && teams.length > 0 && (
        <div className="list-page__grid">
          {teams.map((team) => (
            <div className="card team-card" key={team.id}>
              <h3>{team.name}</h3>
              {team.description && <p className="team-card__desc">{team.description}</p>}
              <p className="team-card__meta">{team.run_count} run{team.run_count === 1 ? '' : 's'} logged</p>
              {isAdmin && (
                <div className="team-card__actions">
                  <button className="btn btn-ghost" onClick={() => startEdit(team)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(team.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
