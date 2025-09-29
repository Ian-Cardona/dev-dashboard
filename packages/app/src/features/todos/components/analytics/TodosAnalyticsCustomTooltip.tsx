export interface TrendDataPoint {
  date: string;
  fullDate: Date;
  todos: number;
  cumulative: number;
  created: number;
  breakdown: Record<string, number>;
}

interface TodosAnalyticsCustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TrendDataPoint;
  }>;
}

const TodosAnalyticsCustomTooltip = ({
  active,
  payload,
}: TodosAnalyticsCustomTooltipProps) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-lg border bg-[var(--color-surface)] text-sm shadow-lg">
      <div className="px-4 py-2 font-medium text-[var(--color-primary)]">
        {formatDate(data.fullDate)}
      </div>

      <div className="px-4 pb-2 text-[var(--color-accent)]">
        {data.todos} resolved {data.created > 0 && `of ${data.created} created`}
      </div>

      {Object.keys(data.breakdown).length > 0 && (
        <div className="border-t border-[var(--color-border)] py-2 text-xs text-[var(--color-accent)]">
          <div className="px-4">
            {Object.entries(data.breakdown).map(([reason, count], index) => (
              <span key={reason}>
                {index > 0 && ', '}
                {count} {reason.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodosAnalyticsCustomTooltip;
