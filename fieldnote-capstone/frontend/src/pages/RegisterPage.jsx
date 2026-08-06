import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

export default function RegisterPage() {
  const { registerUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [apiError, setApiError] = useState('')

  function validate() {
    const errors = {}
    if (!form.name || form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email'
    if (!form.password || form.password.length < 8) errors.password = 'Password must be at least 8 characters'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    setStatus('loading')
    setApiError('')
    try {
      await registerUser(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setStatus('error')
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
      else setApiError(err.message)
    }
  }

  return (
    <div className="container auth-page">
      <form className="card auth-form" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-form__title">Create an account</h1>

        {apiError && <p className="state-banner state-banner--error">{apiError}</p>}

        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          <span className="field-hint">At least 8 characters</span>
        </div>

        <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-form__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
}
