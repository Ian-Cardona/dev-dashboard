import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface TodosToolbarProps {
  title: string;
  onGoLeft: () => void;
  onGoRight: () => void;
  canGoLeft: boolean;
  canGoRight: boolean;
}
// TODO: Use icons and fix spacing
export const TodosToolbar = ({
  title,
  onGoLeft,
  onGoRight,
  canGoLeft,
  canGoRight,
}: TodosToolbarProps) => {
  return (
    <div className="flex shrink-0 items-center justify-center mb-8">
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
        <ChevronLeftIcon className="h-5 w-5 stroke-[var(--color-fg)]" />
      </button>
      <span className="min-w-[160px] select-none mx-4 text-center text-xl font-semibold text-[var(--color-fg)]">
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
        <ChevronRightIcon className="h-5 w-5 stroke-[var(--color-fg)]" />
      </button>
    </div>
  );
};
