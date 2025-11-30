import TodosAnalyticsInfo from '../../../features/todos/components/analytics/TodoAnalyticsInfo';
import TodosAnalyticsCardHeader from '../../../features/todos/components/analytics/TodosAnalyticsCardHeader';
import TodosActivityHeatmap from '../../../features/todos/components/analytics/TodosAnalyticsHeatMap';
import useQueryPendingResolutions from '../../../features/todos/hooks/useQueryPendingResolutions';
import useQueryResolved from '../../../features/todos/hooks/useQueryResolvedTodos';
import type { TodoReasonEnumType } from '@dev-dashboard/shared';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

const completedReasons: TodoReasonEnumType[] = [
  'done',
  'implemented',
  'refactored',
  'done_by_others',
];

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TodosAnalytics = () => {
  const {
    data: resolvedData,
    isLoading: isLoadingResolved,
    isError: isErrorResolved,
  } = useQueryResolved();
  const {
    data: pendingData,
    isLoading: isLoadingPending,
    isError: isErrorPending,
  } = useQueryPendingResolutions();
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const emptyState: EmptyStateProps | null = useMemo(() => {
    if (isErrorResolved || isErrorPending) {
      return {
        icon: (
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-[var(--color-primary)]" />
        ),
        title: 'Failed to load analytics',
        description:
          'There was an error loading todo analytics. Please try again later.',
      };
    }
    if (isLoadingResolved || isLoadingPending) {
      return {
        icon: null,
        title: 'Loading analytics...',
        description: 'Please wait while we fetch your todo data.',
      };
    }
    const totalCount = (resolvedData?.length || 0) + (pendingData?.length || 0);
    if (totalCount === 0) {
      return {
        icon: (
          <ChartBarIcon className="mx-auto h-12 w-12 text-[var(--color-accent)]" />
        ),
        title: 'No todo data available',
        description: 'Complete some todos to see analytics.',
      };
    }
    return null;
  }, [
    isErrorResolved,
    isErrorPending,
    isLoadingResolved,
    isLoadingPending,
    resolvedData,
    pendingData,
  ]);

  const {
    completionRate,
    completed,
    total,
    resolvedCount,
    resolvedRate,
    reasonDistribution,
    totalResolved,
    staleCount,
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

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const staleCount = pendingTodos.filter(todo => {
      if (!todo.createdAt) return false;
      const createdAt = new Date(todo.createdAt);
      return !isNaN(createdAt.getTime()) && createdAt < sevenDaysAgo;
    }).length;

    return {
      completionRate: rate,
      completed: completedCount,
      total: totalCount,
      resolvedCount,
      resolvedRate,
      reasonDistribution,
      totalResolved: resolvedCount,
      staleCount,
    };
  }, [resolvedData, pendingData]);

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="flex items-center text-2xl font-bold text-[var(--color-fg)]">
          Analytics
          {!emptyState && (
            <div className="relative ml-3">
              <InformationCircleIcon
                className="h-5 w-5 cursor-pointer text-[var(--color-accent)] transition-colors duration-200 hover:text-[var(--color-primary)]"
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
              />
              {isTooltipVisible && (
                <div className="absolute top-full left-1/2 z-10 mt-2 w-72 -translate-x-1/2 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-4">
                  <p className="text-left text-sm font-normal text-[var(--color-fg)]">
                    Analytics show your todo completion trends and activity over
                    time. Track your progress with completion rates and
                    resolution patterns.
                  </p>
                </div>
              )}
            </div>
          )}
        </h2>
      </div>
      <div className="flex-1 overflow-hidden">
        {emptyState ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              {emptyState.icon}
              <div className="mt-4 text-lg font-semibold text-[var(--color-fg)]">
                {emptyState.title}
              </div>
              <div className="mt-2 text-sm text-[var(--color-accent)]">
                {emptyState.description}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6 lg:flex lg:flex-col lg:overflow-hidden">
            <div className="grid grid-cols-1 gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-4">
              <div className="flex flex-col gap-4 lg:col-span-1 lg:min-h-0 lg:overflow-y-auto">
                <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
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

                <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
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

                <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
                  <TodosAnalyticsCardHeader title="Stale Todos" />
                  <span className="text-4xl font-bold text-[var(--color-primary)]">
                    {staleCount}
                  </span>
                  <div className="mt-2 text-sm text-[var(--color-fg)]">
                    Pending todos older than 7 days
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
                  <TodosAnalyticsCardHeader title="Outcomes" />
                  <div className="mt-4 space-y-2">
                    {Object.entries(reasonDistribution).map(
                      ([reason, count]) => (
                        <div
                          key={reason}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-[var(--color-fg)] capitalize">
                            {reason.replace('_', ' ')}
                          </span>
                          <span className="font-medium text-[var(--color-primary)]">
                            {count} ({Math.round((count / totalResolved) * 100)}
                            %)
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col gap-6 overflow-hidden rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 lg:col-span-3 lg:flex-row">
                <div className="flex flex-col gap-4 lg:flex-shrink-0">
                  <TodosAnalyticsCardHeader title="Activity Over Last 30 Days" />
                  <TodosActivityHeatmap
                    resolvedData={resolvedData}
                    onDayClick={date => setSelectedDay(date)}
                  />
                </div>
                <div className="flex min-h-0 flex-1 lg:min-w-0">
                  <TodosAnalyticsInfo
                    selectedDay={selectedDay}
                    resolvedData={resolvedData}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const Route = createFileRoute('/_authenticated/todos/analytics')({
  component: TodosAnalytics,
});
