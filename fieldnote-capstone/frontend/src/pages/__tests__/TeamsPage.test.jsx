import { render, screen, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import TeamsPage from '../TeamsPage'
import * as api from '../../api'
import * as AuthContext from '../../context/AuthContext'

vi.mock('../../api')
vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext')
  return { ...actual, useAuth: vi.fn() }
})

describe('TeamsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('shows the create-team form for an admin', async () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: 1, role: 'admin' } })
    api.fetchTeams.mockResolvedValue({ teams: [] })

    render(<TeamsPage />)

    expect(await screen.findByLabelText('Team name')).toBeInTheDocument()
  })

  test('hides the create-team form for a member', async () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: 2, role: 'member' } })
    api.fetchTeams.mockResolvedValue({ teams: [] })

    render(<TeamsPage />)

    await waitFor(() => expect(api.fetchTeams).toHaveBeenCalled())
    expect(screen.queryByLabelText('Team name')).not.toBeInTheDocument()
  })

  test('shows an empty state when there are no teams', async () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: 2, role: 'member' } })
    api.fetchTeams.mockResolvedValue({ teams: [] })

    render(<TeamsPage />)

    expect(await screen.findByText(/no teams yet/i)).toBeInTheDocument()
  })

  test('renders team cards once data loads', async () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: 2, role: 'member' } })
    api.fetchTeams.mockResolvedValue({
      teams: [{ id: 1, name: 'Legged Locomotion', description: 'quadrupeds', run_count: 3 }],
    })

    render(<TeamsPage />)

    expect(await screen.findByText('Legged Locomotion')).toBeInTheDocument()
    expect(screen.getByText('3 runs logged')).toBeInTheDocument()
  })

  test('shows an error state if the request fails', async () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: 2, role: 'member' } })
    api.fetchTeams.mockRejectedValue(new Error('network error'))

    render(<TeamsPage />)

    expect(await screen.findByText(/couldn't load teams/i)).toBeInTheDocument()
  })
})
