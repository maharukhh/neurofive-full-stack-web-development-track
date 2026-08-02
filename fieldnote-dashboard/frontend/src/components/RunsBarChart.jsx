import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

function formatWeek(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function RunsBarChart({ data }) {
  return (
    <ChartCard title="Runs logged per week" caption="Count of experiment runs, by week started">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15, 21, 18, 0.06)" vertical={false} />
          <XAxis
            dataKey="week"
            tickFormatter={formatWeek}
            tick={{ fontSize: 11, fill: '#6c7a70', fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: 'rgba(15, 21, 18, 0.12)' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6c7a70', fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(v) => `Week of ${formatWeek(v)}`}
            contentStyle={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--rule)',
              borderRadius: 6,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" fill="#3b6e52" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
