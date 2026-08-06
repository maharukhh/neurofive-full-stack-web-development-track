import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

export default function LoginPage() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | error

  function validate() {
    const errors = {}
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email'
    if (!form.password) errors.password = 'Password is required'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    setStatus('loading')
    try {
      await loginUser(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setStatus('error')
      setFieldErrors(err.fieldErrors || {})
      setForm((f) => ({ ...f, _apiError: err.message }))
    }
  }

  return (
    <div className="container auth-page">
      <form className="card auth-form" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-form__title">Log in</h1>

        {status === 'error' && (
          <p className="state-banner state-banner--error">Invalid email or password.</p>
        )}

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
        </div>

        <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-form__switch">
          No account yet? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}
