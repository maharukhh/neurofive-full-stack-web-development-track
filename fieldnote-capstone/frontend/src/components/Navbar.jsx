import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, status, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="container navbar__row">
        <Link to="/" className="navbar__brand">§ Fieldnote</Link>
        {status === 'authed' && (
          <>
            <nav className="navbar__links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/teams">Teams</Link>
              <Link to="/runs">Runs</Link>
            </nav>
            <div className="navbar__user">
              <span className="navbar__user-name">{user.name} · {user.role}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
