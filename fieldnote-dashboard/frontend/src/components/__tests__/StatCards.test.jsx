import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import StatCards from '../StatCards'

describe('StatCards', () => {
  const summary = { totalRuns: 253, successRate: 73.5, activeTeams: 4, avgDurationSec: 166 }

  test('renders all four stat labels', () => {
    render(<StatCards summary={summary} />)
    expect(screen.getByText('Total runs logged')).toBeInTheDocument()
    expect(screen.getByText('Success rate')).toBeInTheDocument()
    expect(screen.getByText('Active teams')).toBeInTheDocument()
    expect(screen.getByText('Avg. run duration')).toBeInTheDocument()
  })

  test('renders the values passed in via the summary prop', () => {
    render(<StatCards summary={summary} />)
    expect(screen.getByText('253')).toBeInTheDocument()
    expect(screen.getByText('73.5')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('166')).toBeInTheDocument()
  })
})
