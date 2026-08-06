import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireRole }) {
  const { user, status } = useAuth()

  if (status === 'checking') {
    return <div className="container"><p className="state-banner">Checking your session…</p></div>
  }
  if (status === 'anon') {
    return <Navigate to="/login" replace />
  }
  if (requireRole && user.role !== requireRole) {
    return (
      <div className="container">
        <p className="state-banner state-banner--error">
          This page requires the "{requireRole}" role. You're signed in as "{user.role}".
        </p>
      </div>
    )
  }
  return children
}
