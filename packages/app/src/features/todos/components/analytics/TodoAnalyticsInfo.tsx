type TodosAnalyticsInfoProps = {
  selectedDay: string | null;
  resolvedData?: Array<{
    content: string;
    reason?: string;
    filePath?: string;
    lineNumber?: number;
    resolvedAt?: string;
  }> | null;
};

const TodosAnalyticsInfo = ({
  selectedDay,
  resolvedData,
}: TodosAnalyticsInfoProps) => {
  return selectedDay ? (
    <div className="flex min-w-full flex-col rounded-2xl border bg-[var(--color-surface)] lg:flex-1">
      <div className="flex-shrink-0 p-6 pb-4">
        <h3 className="text-xl font-semibold">
          Details for {new Date(selectedDay).toLocaleDateString()}
        </h3>
      </div>
      <div className="px-6 pb-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {resolvedData &&
        resolvedData.filter(
          todo => todo.resolvedAt?.slice(0, 10) === selectedDay
        ).length > 0 ? (
          resolvedData
            .filter(todo => todo.resolvedAt?.slice(0, 10) === selectedDay)
            .map((todo, index) => (
              <div
                key={index}
                className="mb-4 overflow-auto rounded-2xl border p-4"
              >
                <div className="mb-2 text-[var(--color-fg)]">
                  {todo.content}
                </div>
                <div className="space-y-1 text-xs text-[var(--color-muted)]">
                  <div>Reason: {todo.reason || 'N/A'}</div>
                  <div>File: {todo.filePath || 'N/A'}</div>
                  <div>
                    Line:{' '}
                    {todo.lineNumber !== undefined ? todo.lineNumber : 'N/A'}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="text-sm text-[var(--color-muted)]">
            No todos resolved on this day.
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center rounded-2xl border bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-muted)] lg:h-full lg:flex-1">
      Click a day on the heatmap to see details
    </div>
  );
};

export default TodosAnalyticsInfo;
