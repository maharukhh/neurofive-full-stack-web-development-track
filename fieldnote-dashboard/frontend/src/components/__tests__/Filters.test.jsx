import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Filters from '../Filters'

const meta = {
  teams: ['All', 'Legged Locomotion', 'Soft Gripper'],
  categories: ['All', 'Robotics', 'Computer Vision'],
  dateRange: { min: '2026-04-11', max: '2026-07-31' },
}

const filters = { from: '2026-04-11', to: '2026-07-31', category: 'All', team: 'All' }

describe('Filters', () => {
  test('renders every team and category option from meta', () => {
    render(<Filters meta={meta} filters={filters} onChange={() => {}} />)
    expect(screen.getByRole('option', { name: 'Legged Locomotion' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Robotics' })).toBeInTheDocument()
  })

  test('date inputs are bounded to the dataset\'s min/max range', () => {
    render(<Filters meta={meta} filters={filters} onChange={() => {}} />)
    const fromInput = screen.getByLabelText('From')
    expect(fromInput).toHaveAttribute('min', '2026-04-11')
    expect(fromInput).toHaveAttribute('max', '2026-07-31')
  })

  test('selecting a category calls onChange with the updated filter state', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Filters meta={meta} filters={filters} onChange={onChange} />)

    await user.selectOptions(screen.getByLabelText('Category'), 'Robotics')

    expect(onChange).toHaveBeenCalledWith({ ...filters, category: 'Robotics' })
  })

  test('selecting a team calls onChange without touching other filter fields', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Filters meta={meta} filters={filters} onChange={onChange} />)

    await user.selectOptions(screen.getByLabelText('Team'), 'Soft Gripper')

    expect(onChange).toHaveBeenCalledWith({ ...filters, team: 'Soft Gripper' })
  })
})
