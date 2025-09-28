import useQueryResolved from '../hooks/useQueryResolved';
import type { TrendDataPoint } from './analytics/CustomTooltip';
import TodosAnalyticsTrendsChart from './analytics/TodosAnalyticsTrendsChart';
import type { TodoReasonEnumType } from '@dev-dashboard/shared';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

interface TodoNode {
  reason?: string;
  createdAt?: string;
  resolvedAt?: string;
}

//TODO: Implement this correctly
const completedReasons: TodoReasonEnumType[] = [
  'done',
  'implemented',
  'refactored',
  'done_by_others',
];

const TodosAnalytics = () => {
  const { data } = useQueryResolved();

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const { completionRate, trendData, completed, total, breakdownAggregate } =
    useMemo(() => {
      if (!data)
        return {
          completionRate: 0,
          trendData: [],
          completed: 0,
          total: 0,
          breakdownAggregate: {},
        };

      const totalCount = data.length;
      const completedCount = data.filter(
        todo =>
          todo.reason &&
          completedReasons.includes(todo.reason as TodoReasonEnumType)
      ).length;
      const rate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
          completedReasons.includes(todo.reason as TodoReasonEnumType)
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

      const sortedDates = Array.from(dateMap.keys()).sort();

      sortedDates.forEach(dateStr => {
        const value = dateMap.get(dateStr)!;
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

      // Aggregate breakdown for last day or overall trend data
      const lastDayBreakdown =
        trend.length > 0 ? trend[trend.length - 1].breakdown : {};
      const breakdownAggregate: Record<string, number> = {};
      trend.forEach(day => {
        Object.entries(day.breakdown).forEach(([reason, count]) => {
          breakdownAggregate[reason] =
            (breakdownAggregate[reason] || 0) + count;
        });
      });

      return {
        completionRate: rate,
        trendData: trend,
        completed: completedCount,
        total: totalCount,
        breakdownAggregate,
      };
    }, [data, completedReasons]);

  return (
    <div className="flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] px-8 py-8">
      <div className="mb-6 flex flex-col items-center justify-center py-4">
        <div className="flex items-center">
          <span className="text-[5rem] leading-none font-extrabold text-[var(--color-primary)]">
            {Math.round(completionRate)}%
          </span>
        </div>
        <div className="mt-2 text-sm font-medium text-[var(--color-primary)]">
          {completed} of {total} todos completed
        </div>
        <div className="mt-1 flex items-center text-sm">
          <span>Completion Rate</span>
          <div className="relative ml-2 flex items-center">
            <InformationCircleIcon
              className="h-5 w-5 cursor-pointer"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            />
            {isTooltipVisible && (
              <div className="absolute top-full left-1/2 z-10 mt-2 w-72 -translate-x-1/2 rounded-2xl border bg-[var(--color-surface)] p-4 shadow-lg">
                <p className="text-left text-sm font-normal">
                  Completion rate shows the percentage of completed todos
                  relative to total todos.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 w-full max-w-xs">
          <h4 className="mb-2 text-sm font-semibold text-[var(--color-primary)]">
            Breakdown by Reason
          </h4>
          <ul className="list-inside list-disc text-sm text-[var(--color-primary)]">
            {Object.entries(breakdownAggregate).map(([reason, count]) => (
              <li key={reason}>
                {reason}: {count}
              </li>
            ))}
            {Object.keys(breakdownAggregate).length === 0 && (
              <li>No completed todos yet</li>
            )}
          </ul>
        </div>
      </div>

      <h3 className="mb-4 text-center text-base font-medium text-[var(--color-primary)]">
        Resolved and Created Todos Trend (Last 7 days)
      </h3>
      <TodosAnalyticsTrendsChart trendData={trendData} />
    </div>
  );
};

export default TodosAnalytics;
