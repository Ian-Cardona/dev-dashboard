import { InboxIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  message: string;
}

export const EmptyState = ({ title, message }: EmptyStateProps) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <InboxIcon className="mx-auto h-12 w-12 text-[var(--color-accent)]" />
        <div className="mt-4 text-lg font-semibold text-[var(--color-fg)]">
          {title}
        </div>
        <div className="mt-2 text-sm text-[var(--color-accent)]">{message}</div>
      </div>
    </div>
  );
};
