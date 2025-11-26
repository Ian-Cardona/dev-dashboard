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
    <div className="flex min-w-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] lg:flex-1">
      <div className="flex-shrink-0 p-6 pb-4">
        <h3 className="text-xl font-semibold text-[var(--color-fg)]">
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
                className="mb-4 overflow-auto rounded-lg border border-[var(--color-accent)]/20 p-4 transition-all duration-200 hover:bg-[var(--color-bg)]"
              >
                <div className="mb-2 text-[var(--color-fg)]">
                  {todo.content}
                </div>
                <div className="space-y-1 text-sm text-[var(--color-accent)]">
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
          <div className="text-sm text-[var(--color-accent)]">
            No todos resolved on this day.
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-accent)] lg:h-full lg:flex-1">
      Click a day on the heatmap to see details
    </div>
  );
};

export default TodosAnalyticsInfo;
