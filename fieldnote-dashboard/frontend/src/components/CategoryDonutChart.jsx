import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

const COLORS = ['#3b6e52', '#c97a2e', '#9aa79c', '#c9463c']

export default function CategoryDonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <ChartCard title="Runs by category" caption={`${total} runs across ${data.length} categories`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} runs`, name]}
            contentStyle={{
              background: '#ffffff',
              border: '1px solid rgba(15, 21, 18, 0.12)',
              borderRadius: 6,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6c7a70' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
