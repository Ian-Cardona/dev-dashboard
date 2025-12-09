import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface TodosHistoryProjectMenuProps {
  title: string;
  onGoLeft: () => void;
  onGoRight: () => void;
  canGoLeft: boolean;
  canGoRight: boolean;
}

const TodosHistoryProjectMenu = ({
  title,
  onGoLeft,
  onGoRight,
  canGoLeft,
  canGoRight,
}: TodosHistoryProjectMenuProps) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onGoLeft}
        disabled={!canGoLeft}
        className="flex items-center justify-center rounded-lg border border-[var(--color-accent)]/20 p-2 text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous Project"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <span className="min-w-[160px] text-center text-base font-semibold text-[var(--color-fg)] select-none">
        {title}
      </span>
      <button
        onClick={onGoRight}
        disabled={!canGoRight}
        className="flex items-center justify-center rounded-lg border border-[var(--color-accent)]/20 p-2 text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next Project"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TodosHistoryProjectMenu;
