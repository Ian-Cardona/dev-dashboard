import useQueryPendingResolutions from '../hooks/useQueryPendingResolutions';
import useQueryResolved from '../hooks/useQueryResolved';
import TodosAnalyticsCardHeader from './analytics/TodosAnalyticsCardHeader';
import TodosActivityHeatmap from './analytics/TodosAnalyticsHeatMap';
import type { TodoReasonEnumType } from '@dev-dashboard/shared';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

const completedReasons: TodoReasonEnumType[] = [
  'done',
  'implemented',
  'refactored',
  'done_by_others',
];

const TodosAnalytics = () => {
  const { data: resolvedData } = useQueryResolved();
  const { data: pendingData } = useQueryPendingResolutions();
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const {
    completionRate,
    completed,
    total,
    resolvedCount,
    resolvedRate,
    reasonDistribution,
    totalResolved,
  } = useMemo(() => {
    const resolvedTodos = resolvedData || [];
    const pendingTodos = pendingData || [];

    const totalCount = resolvedTodos.length + pendingTodos.length;
    const completedCount = resolvedTodos.filter(
      todo =>
        todo.reason &&
        completedReasons.includes(todo.reason as TodoReasonEnumType)
    ).length;
    const resolvedCount = resolvedTodos.length;
    const rate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const resolvedRate =
      totalCount > 0 ? (resolvedCount / totalCount) * 100 : 0;

    const reasonDistribution = resolvedTodos.reduce(
      (acc, todo) => {
        if (todo.reason) {
          acc[todo.reason] = (acc[todo.reason] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      completionRate: rate,
      completed: completedCount,
      total: totalCount,
      resolvedCount,
      resolvedRate,
      reasonDistribution,
      totalResolved: resolvedCount,
    };
  }, [resolvedData, pendingData]);

  if (!resolvedData && !pendingData) {
    return (
      <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
        <div className="mb-8 flex items-center justify-between px-8">
          <h2 className="flex items-center text-3xl">Analytics</h2>
        </div>
        <div className="flex-1 overflow-hidden rounded-b-4xl">
          <div className="flex h-full items-center justify-center">
            <div className="text-[var(--color-accent)]">
              Loading analytics...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (total === 0) {
    return (
      <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
        <div className="mb-8 flex items-center justify-between px-8">
          <h2 className="flex items-center text-3xl">Analytics</h2>
        </div>
        <div className="flex-1 overflow-hidden rounded-b-4xl">
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-[var(--color-accent)]">
              <div className="text-lg font-medium">No todo data available</div>
              <div className="mt-2 text-sm">
                Complete some todos to see analytics
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="flex items-center text-3xl">
          Analytics
          <div className="relative ml-3">
            <InformationCircleIcon
              className="h-6 w-6 cursor-pointer"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            />
            {isTooltipVisible && (
              <div className="absolute top-full left-1/2 z-10 mt-2 w-72 -translate-x-1/2 rounded-2xl border bg-[var(--color-surface)] p-4 shadow-lg">
                <p className="text-left text-sm font-normal">
                  Analytics show your todo completion trends and activity over
                  time. Track your progress with completion rates and resolution
                  patterns.
                </p>
              </div>
            )}
          </div>
        </h2>
      </div>
      <div className="flex-1 overflow-hidden rounded-b-4xl">
        <div className="h-full overflow-y-auto px-8 pb-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="flex flex-col gap-4 lg:col-span-1">
              <div className="rounded-2xl border bg-[var(--color-surface)] p-6">
                <TodosAnalyticsCardHeader
                  title="Completion Rate"
                  tooltip="Completion rate shows the percentage of completed todos relative to total todos."
                />
                <span className="text-4xl font-bold text-[var(--color-primary)]">
                  {Math.round(completionRate)}%
                </span>
                <div className="mt-2 text-sm text-[var(--color-fg)]">
                  {completed} of {total} todos
                </div>
              </div>

              <div className="rounded-2xl border bg-[var(--color-surface)] p-6">
                <TodosAnalyticsCardHeader
                  title="Resolved Rate"
                  tooltip="Resolved rate shows the percentage of todos with any reason relative to total todos."
                />
                <span className="text-4xl font-bold text-[var(--color-primary)]">
                  {Math.round(resolvedRate)}%
                </span>
                <div className="mt-2 text-sm text-[var(--color-fg)]">
                  {resolvedCount} of {total} todos
                </div>
              </div>

              <div className="rounded-2xl border bg-[var(--color-surface)] p-6">
                <TodosAnalyticsCardHeader
                  title="Resolution Types"
                  tooltip="Breakdown of how todos are being resolved"
                />
                <div className="mt-4 space-y-2">
                  {Object.entries(reasonDistribution).map(([reason, count]) => (
                    <div key={reason} className="flex justify-between text-sm">
                      <span className="text-[var(--color-fg)] capitalize">
                        {reason.replace('_', ' ')}
                      </span>
                      <span className="font-medium text-[var(--color-primary)]">
                        {count} ({Math.round((count / totalResolved) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-[var(--color-surface)] p-6 lg:col-span-3">
              <TodosAnalyticsCardHeader title="Activity Over Time" />
              <div className="w-full">
                <TodosActivityHeatmap resolvedData={resolvedData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodosAnalytics;
