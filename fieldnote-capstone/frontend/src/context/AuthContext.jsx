import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import * as api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('checking') // checking | authed | anon

  useEffect(() => {
    const token = localStorage.getItem('fieldnote_token')
    if (!token) {
      setStatus('anon')
      return
    }
    api
      .fetchMe()
      .then((data) => {
        setUser(data.user)
        setStatus('authed')
      })
      .catch(() => {
        localStorage.removeItem('fieldnote_token')
        setStatus('anon')
      })
  }, [])

  const loginUser = useCallback(async (email, password) => {
    const data = await api.login({ email, password })
    localStorage.setItem('fieldnote_token', data.token)
    setUser(data.user)
    setStatus('authed')
    return data.user
  }, [])

  const registerUser = useCallback(async (name, email, password) => {
    const data = await api.register({ name, email, password })
    localStorage.setItem('fieldnote_token', data.token)
    setUser(data.user)
    setStatus('authed')
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('fieldnote_token')
    setUser(null)
    setStatus('anon')
  }, [])

  return (
    <AuthContext.Provider value={{ user, status, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
