import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import LoginPage from '../LoginPage'
import * as AuthContext from '../../context/AuthContext'

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext')
  return { ...actual, useAuth: vi.fn() }
})

describe('LoginPage', () => {
  const loginUser = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    AuthContext.useAuth.mockReturnValue({ loginUser })
  })

  test('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    expect(loginUser).not.toHaveBeenCalled()
  })

  test('calls loginUser with the entered credentials on valid submit', async () => {
    loginUser.mockResolvedValue({ id: 1, role: 'member' })
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    await user.type(screen.getByLabelText('Email'), 'ada@fieldnote.test')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('ada@fieldnote.test', 'password123')
    })
  })

  test('shows an error banner when login fails', async () => {
    loginUser.mockRejectedValue(new Error('Invalid email or password'))
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    await user.type(screen.getByLabelText('Email'), 'ada@fieldnote.test')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })
})
