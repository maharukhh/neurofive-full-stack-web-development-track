import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

function formatWeek(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function SuccessLineChart({ data }) {
  return (
    <ChartCard title="Success rate trend" caption="Share of runs marked nominal, by week">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
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
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: '#6c7a70', fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            labelFormatter={(v) => `Week of ${formatWeek(v)}`}
            formatter={(value) => [`${value}%`, 'Success rate']}
            contentStyle={{
              background: '#ffffff',
              border: '1px solid rgba(15, 21, 18, 0.12)',
              borderRadius: 6,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#c97a2e"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#c97a2e' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
