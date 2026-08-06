import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import Navbar from '../Navbar'
import * as AuthContext from '../../context/AuthContext'

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext')
  return { ...actual, useAuth: vi.fn() }
})

describe('Navbar', () => {
  test('shows nav links and user info when authenticated', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { name: 'Ada Lovelace', role: 'admin' },
      status: 'authed',
      logout: vi.fn(),
    })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Teams')).toBeInTheDocument()
    expect(screen.getByText('Runs')).toBeInTheDocument()
    expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument()
  })

  test('hides nav links and user info when not authenticated', () => {
    AuthContext.useAuth.mockReturnValue({ user: null, status: 'anon', logout: vi.fn() })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Teams')).not.toBeInTheDocument()
  })
})
