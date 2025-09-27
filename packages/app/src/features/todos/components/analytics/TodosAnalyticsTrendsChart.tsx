import CustomTooltip, { type TrendDataPoint } from './CustomTooltip';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface TodosAnalyticsTrendChartProps {
  trendData: TrendDataPoint[];
}

const TodosAnalyticsTrendChart = ({
  trendData,
}: TodosAnalyticsTrendChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={trendData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          strokeOpacity={0.3}
        />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--color-fg)' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--color-fg)' }}
          domain={[0, 'dataMax']}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: 'var(--color-primary)',
            strokeWidth: 1,
            strokeDasharray: '4 4',
          }}
        />
        <Line
          type="monotone"
          dataKey="todos"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-primary)', strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: 'var(--color-primary)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TodosAnalyticsTrendChart;
