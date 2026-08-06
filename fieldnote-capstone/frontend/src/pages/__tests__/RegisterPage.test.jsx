import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import RegisterPage from '../RegisterPage'
import * as AuthContext from '../../context/AuthContext'

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext')
  return { ...actual, useAuth: vi.fn() }
})

describe('RegisterPage', () => {
  const registerUser = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    AuthContext.useAuth.mockReturnValue({ registerUser })
  })

  test('rejects a password under 8 characters before calling the API', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><RegisterPage /></MemoryRouter>)

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@fieldnote.test')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    expect(registerUser).not.toHaveBeenCalled()
  })

  test('rejects a name under 2 characters', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><RegisterPage /></MemoryRouter>)

    await user.type(screen.getByLabelText('Name'), 'A')
    await user.type(screen.getByLabelText('Email'), 'ada@fieldnote.test')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument()
    expect(registerUser).not.toHaveBeenCalled()
  })
})
