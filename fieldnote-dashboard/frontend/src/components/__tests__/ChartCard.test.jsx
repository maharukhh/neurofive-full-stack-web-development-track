import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import ChartCard from '../ChartCard'

describe('ChartCard', () => {
  test('renders the title and caption', () => {
    render(
      <ChartCard title="Runs by category" caption="12 runs across 3 categories">
        <div>chart placeholder</div>
      </ChartCard>
    )
    expect(screen.getByText('Runs by category')).toBeInTheDocument()
    expect(screen.getByText('12 runs across 3 categories')).toBeInTheDocument()
  })

  test('renders children content passed to it', () => {
    render(
      <ChartCard title="Test chart">
        <div data-testid="chart-body">the actual chart</div>
      </ChartCard>
    )
    expect(screen.getByTestId('chart-body')).toBeInTheDocument()
  })

  test('omits the caption element when none is provided', () => {
    const { container } = render(
      <ChartCard title="No caption here">
        <div />
      </ChartCard>
    )
    expect(container.querySelector('.chart-card__caption')).not.toBeInTheDocument()
  })
})
