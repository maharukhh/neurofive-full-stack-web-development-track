import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import ProtectedRoute from '../ProtectedRoute'
import * as AuthContext from '../../context/AuthContext'

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext')
  return { ...actual, useAuth: vi.fn() }
})

function renderAt(path, ui) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/protected" element={ui} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  test('redirects to /login when the user is not authenticated', () => {
    AuthContext.useAuth.mockReturnValue({ user: null, status: 'anon' })
    renderAt('/protected', <ProtectedRoute><div>Secret content</div></ProtectedRoute>)
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument()
  })

  test('shows a checking state while the session is being verified', () => {
    AuthContext.useAuth.mockReturnValue({ user: null, status: 'checking' })
    renderAt('/protected', <ProtectedRoute><div>Secret content</div></ProtectedRoute>)
    expect(screen.getByText(/Checking your session/i)).toBeInTheDocument()
  })

  test('renders children when the user is authenticated', () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: 1, role: 'member' }, status: 'authed' })
    renderAt('/protected', <ProtectedRoute><div>Secret content</div></ProtectedRoute>)
    expect(screen.getByText('Secret content')).toBeInTheDocument()
  })

  test('shows a role-required message when the user lacks the required role', () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: 1, role: 'member' }, status: 'authed' })
    renderAt('/protected', <ProtectedRoute requireRole="admin"><div>Admin content</div></ProtectedRoute>)
    expect(screen.getByText(/requires the "admin" role/i)).toBeInTheDocument()
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument()
  })
})
