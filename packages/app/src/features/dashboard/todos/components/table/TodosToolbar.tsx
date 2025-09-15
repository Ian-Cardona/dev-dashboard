import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface TodosToolbarProps {
  title: string;
  onGoLeft: () => void;
  onGoRight: () => void;
  canGoLeft: boolean;
  canGoRight: boolean;
}

export const TodosToolbar: React.FC<TodosToolbarProps> = ({
  title,
  onGoLeft,
  onGoRight,
  canGoLeft,
  canGoRight,
}) => {
  return (
    <div className="flex shrink-0 items-center justify-between px-4 mb-4">
      <button
        onClick={onGoLeft}
        disabled={!canGoLeft}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-fg)]/20 transition-colors ${
          canGoLeft
            ? 'hover:bg-[var(--color-fg)]/5'
            : 'cursor-not-allowed opacity-50'
        }`}
        aria-label="Previous Project"
      >
        <ChevronLeftIcon className="h-4 w-4 stroke-[var(--color-fg)]" />
      </button>
      <span className="min-w-[160px] select-none text-center text-base font-normal uppercase text-[var(--color-fg)]">
        {title}
      </span>
      <button
        onClick={onGoRight}
        disabled={!canGoRight}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-fg)]/20 transition-colors ${
          canGoRight
            ? 'hover:bg-[var(--color-fg)]/5'
            : 'cursor-not-allowed opacity-50'
        }`}
        aria-label="Next Project"
      >
        <ChevronRightIcon className="h-4 w-4 stroke-[var(--color-fg)]" />
      </button>
    </div>
  );
};
