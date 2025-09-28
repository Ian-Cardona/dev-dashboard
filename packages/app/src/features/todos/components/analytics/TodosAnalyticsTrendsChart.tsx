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
          tick={{ fontSize: 12, fill: 'var(--color-accent)', dy: 10 }}
          interval="preserveStartEnd"
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--color-accent)' }}
          domain={[0, 'dataMax']}
          padding={{ top: 10, bottom: 10 }}
          tickCount={6}
          allowDecimals={false}
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
