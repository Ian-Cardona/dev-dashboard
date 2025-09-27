import useQueryResolved from '../hooks/useQueryResolved';
import type { TrendDataPoint } from './analytics/CustomTooltip';
import TodosAnalyticsTrendsChart from './analytics/TodosAnalyticsTrendsChart';
import { useMemo } from 'react';

interface TodoNode {
  reason?: string;
  createdAt?: string;
  resolvedAt?: string;
}

const TodosAnalytics = () => {
  const { data } = useQueryResolved();
  const completedReasons = [
    'done',
    'implemented',
    'refactored',
    'done_by_others',
  ];

  const { completionRate, trendData } = useMemo(() => {
    if (!data) return { completionRate: 0, trendData: [] };

    const total = data.length;
    const completed = data.filter(
      todo => todo.reason && completedReasons.includes(todo.reason)
    ).length;
    const rate = total > 0 ? (completed / total) * 100 : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateMap = new Map<
      string,
      {
        resolved: TodoNode[];
        created: TodoNode[];
      }
    >();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dateMap.set(key, { resolved: [], created: [] });
    }

    data.forEach(todo => {
      if (
        todo.resolvedAt &&
        todo.reason &&
        completedReasons.includes(todo.reason)
      ) {
        const resolvedKey = todo.resolvedAt.slice(0, 10);
        if (dateMap.has(resolvedKey)) {
          dateMap.get(resolvedKey)!.resolved.push(todo);
        }
      }

      if (todo.createdAt) {
        const createdKey = todo.createdAt.slice(0, 10);
        if (dateMap.has(createdKey)) {
          dateMap.get(createdKey)!.created.push(todo);
        }
      }
    });

    let cumulative = 0;
    const trend: TrendDataPoint[] = [];

    dateMap.forEach((value, dateStr) => {
      const date = new Date(dateStr);
      const resolved = value.resolved;
      const breakdown: Record<string, number> = {};

      resolved.forEach(todo => {
        if (todo.reason) {
          breakdown[todo.reason] = (breakdown[todo.reason] || 0) + 1;
        }
      });

      cumulative += resolved.length;

      trend.push({
        date: date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
        fullDate: date,
        todos: resolved.length,
        cumulative,
        created: value.created.length,
        breakdown,
      });
    });

    return { completionRate: rate, trendData: trend };
  }, [data, completedReasons]);

  return (
    <div className="flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] px-8 py-8">
      <div className="mb-6 flex flex-col items-center justify-center py-4">
        <span className="text-[5rem] leading-none font-extrabold text-[var(--color-primary)]">
          {Math.round(completionRate)}%
        </span>
        <p className="mt-1 text-sm text-[var(--color-accent)]">
          Completion Rate
        </p>
      </div>

      <h3 className="mb-4 text-center text-base font-medium text-[var(--color-primary)]">
        Resolved Todos Trend (Last 7 days)
      </h3>
      <TodosAnalyticsTrendsChart trendData={trendData} />
    </div>
  );
};

export default TodosAnalytics;
