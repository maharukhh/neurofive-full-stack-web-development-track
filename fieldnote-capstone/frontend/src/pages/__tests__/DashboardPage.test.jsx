import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import DashboardPage from '../DashboardPage'
import * as api from '../../api'

vi.mock('../../api')

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders stat cards from the dashboard API response', async () => {
    api.fetchDashboard.mockResolvedValue({
      summary: { totalRuns: 12, successRate: 75, activeTeams: 3, avgDurationSec: 90 },
      categoryBreakdown: [{ name: 'Robotics', value: 12 }],
      statusBreakdown: [{ name: 'nominal', value: 9 }, { name: 'watch', value: 3 }],
      byTeam: [{ team: 'Perception', count: 12 }],
    })

    render(<DashboardPage />)

    expect(await screen.findByText('12')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('Total runs')).toBeInTheDocument()
  })

  test('shows an empty-state message when there are no runs yet', async () => {
    api.fetchDashboard.mockResolvedValue({
      summary: { totalRuns: 0, successRate: 0, activeTeams: 0, avgDurationSec: 0 },
      categoryBreakdown: [],
      statusBreakdown: [],
      byTeam: [],
    })

    render(<DashboardPage />)

    expect(await screen.findByText(/no runs logged yet/i)).toBeInTheDocument()
  })
})
