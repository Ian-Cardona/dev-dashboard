import { useMemo, useState } from 'react';

interface TodoNode {
  reason?: string;
  resolvedAt?: string;
}

interface HeatmapDataPoint {
  date: string;
  count: number;
  day: number;
  week: number;
}

interface TodosActivityHeatmapProps {
  resolvedData?: TodoNode[];
}

const TodosActivityHeatmap = ({ resolvedData }: TodosActivityHeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapDataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const { heatmapData, maxCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const countMap = new Map<string, number>();

    resolvedData?.forEach(todo => {
      if (todo.resolvedAt && todo.reason) {
        const dateKey = todo.resolvedAt.slice(0, 10);
        countMap.set(dateKey, (countMap.get(dateKey) || 0) + 1);
      }
    });

    const days: HeatmapDataPoint[] = [];
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateStr = date.toISOString().slice(0, 10);
      const count = countMap.get(dateStr) || 0;

      days.push({
        date: dateStr,
        count,
        day: date.getDay(),
        week: Math.floor((89 - i) / 7),
      });
    }

    const max = Math.max(...days.map(d => d.count), 1);

    return {
      heatmapData: days,
      maxCount: max,
    };
  }, [resolvedData]);

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  };

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-transparent';
    if (intensity === 1) return 'bg-[var(--color-primary)]/20';
    if (intensity === 2) return 'bg-[var(--color-primary)]/40';
    if (intensity === 3) return 'bg-[var(--color-primary)]/60';
    return 'bg-[var(--color-primary)]';
  };

  const handleCellHover = (cell: HeatmapDataPoint, event: React.MouseEvent) => {
    setHoveredCell(cell);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const weeks = Math.ceil(heatmapData.length / 7);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-start gap-6">
        <div className="flex flex-col gap-2 pt-8">
          {dayLabels.map((day, i) => (
            <div
              key={i}
              className="flex h-8 w-8 items-center justify-center text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex gap-2">
            {Array.from({ length: weeks }, (_, i) => {
              const monthDate = new Date();
              monthDate.setDate(monthDate.getDate() - (89 - i * 7));
              const monthName = monthDate.toLocaleDateString('en-US', {
                month: 'short',
              });

              const prevMonthDate = new Date();
              if (i > 0) {
                prevMonthDate.setDate(
                  prevMonthDate.getDate() - (89 - (i - 1) * 7)
                );
              }
              const showLabel =
                i === 0 ||
                (i > 0 && monthDate.getMonth() !== prevMonthDate.getMonth());

              return (
                <div key={i} className="w-8 text-center text-sm">
                  {showLabel ? monthName : ''}
                </div>
              );
            })}
          </div>

          <div
            className="grid grid-flow-col gap-2"
            style={{ gridTemplateRows: 'repeat(7, 32px)' }}
          >
            {heatmapData.map(cell => {
              const intensity = getIntensity(cell.count);

              return (
                <div
                  key={cell.date}
                  className={`h-8 w-8 cursor-pointer rounded border ${getColor(intensity)} hover:border-[var(--color-primary)]`}
                  onMouseEnter={e => handleCellHover(cell, e)}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              );
            })}
          </div>

          <div className="mt-6 flex w-full items-center justify-end gap-3 text-sm">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(intensity => (
              <div
                key={intensity}
                className={`h-6 w-6 rounded border ${getColor(intensity)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {hoveredCell && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl border bg-[var(--color-surface)] px-4 py-3 shadow-lg"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-sm font-medium text-[var(--color-fg)]">
            {new Date(hoveredCell.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="text-base text-[var(--color-primary)]">
            {hoveredCell.count} {hoveredCell.count === 1 ? 'todo' : 'todos'}{' '}
            resolved
          </div>
        </div>
      )}
    </div>
  );
};

export default TodosActivityHeatmap;
