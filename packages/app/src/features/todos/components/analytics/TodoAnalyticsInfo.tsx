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
      <div className="border-b border-[var(--color-accent)]/20 p-6">
        <h3 className="text-xl font-bold text-[var(--color-fg)]">
          {new Date(selectedDay).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h3>
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          {resolvedData &&
          resolvedData.filter(
            todo => todo.resolvedAt?.slice(0, 10) === selectedDay
          ).length > 0 ? (
            <div className="space-y-4">
              {resolvedData
                .filter(todo => todo.resolvedAt?.slice(0, 10) === selectedDay)
                .map((todo, index) => {
                  const fileName =
                    todo.filePath?.split('/').pop() || todo.filePath || 'N/A';

                  return (
                    <div
                      key={index}
                      className="group rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md"
                    >
                      <div className="mb-4 text-base font-semibold text-[var(--color-fg)]">
                        {todo.content}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--color-accent)]">
                            Reason:
                          </span>
                          <span className="font-medium text-[var(--color-fg)] capitalize">
                            {todo.reason?.replace(/_/g, ' ') || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--color-accent)]">
                            File:
                          </span>
                          <span
                            className="max-w-[200px] truncate font-medium text-[var(--color-fg)]"
                            title={todo.filePath}
                          >
                            {fileName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--color-accent)]">
                            Line:
                          </span>
                          <span className="font-medium text-[var(--color-fg)]">
                            {todo.lineNumber !== undefined
                              ? todo.lineNumber
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-sm text-[var(--color-accent)]">
                No todos resolved on this day.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-accent)] lg:h-full lg:flex-1">
      Click a day on the heatmap to see details
    </div>
  );
};

export default TodosAnalyticsInfo;
