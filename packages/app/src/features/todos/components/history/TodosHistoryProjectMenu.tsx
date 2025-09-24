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
    <div className="flex items-center justify-between px-4">
      <button
        onClick={onGoLeft}
        disabled={!canGoLeft}
        className="flex h-8 w-8 items-center justify-center rounded-4xl border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-surface)]"
        aria-label="Previous Project"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <span className="min-w-[160px] select-none text-center text-base uppercase">
        {title}
      </span>
      <button
        onClick={onGoRight}
        disabled={!canGoRight}
        className="flex h-8 w-8 items-center justify-center rounded-4xl border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-surface)]"
        aria-label="Next Project"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TodosHistoryProjectMenu;
