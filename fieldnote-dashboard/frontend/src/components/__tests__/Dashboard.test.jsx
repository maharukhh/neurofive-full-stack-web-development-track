import { render, screen, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import Dashboard from '../Dashboard'
import * as api from '../../api'

vi.mock('../../api')

const mockMeta = {
  teams: ['All', 'Legged Locomotion'],
  categories: ['All', 'Robotics'],
  dateRange: { min: '2026-04-11', max: '2026-07-31' },
}

const mockDashboardData = {
  summary: { totalRuns: 42, successRate: 80, activeTeams: 2, avgDurationSec: 120 },
  runsByWeek: [{ week: '2026-07-06', count: 10 }],
  successTrend: [{ week: '2026-07-06', rate: 80 }],
  categoryBreakdown: [{ name: 'Robotics', value: 42 }],
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('shows loading state, then renders stat cards once data resolves', async () => {
    api.fetchMeta.mockResolvedValue(mockMeta)
    api.fetchDashboard.mockResolvedValue(mockDashboardData)

    render(<Dashboard />)

    expect(screen.getByText(/Loading run data/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Total runs logged')).toBeInTheDocument()
    })
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  test('shows an error message if the backend is unreachable', async () => {
    api.fetchMeta.mockRejectedValue(new Error('network error'))

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Couldn't reach the dashboard API/i)).toBeInTheDocument()
    })
  })
})
