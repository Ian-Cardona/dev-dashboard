import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  isUnauthorized?: boolean;
}

export const ErrorState = ({
  message,
  onRetry,
  isUnauthorized = false,
}: ErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        {isUnauthorized ? (
          <LinkIcon className="mx-auto h-12 w-12 text-[var(--color-primary)]" />
        ) : (
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-[var(--color-primary)]" />
        )}
        <div className="mt-4 text-lg font-semibold text-[var(--color-fg)]">
          {isUnauthorized ? 'GitHub not connected' : 'Failed to load'}
        </div>
        <div className="mt-2 text-sm text-[var(--color-accent)]">
          {isUnauthorized ? 'Connect your GitHub account to continue' : message}
        </div>
        {isUnauthorized ? (
          <button
            onClick={() => navigate('/settings')}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary)]/90"
          >
            <LinkIcon className="h-4 w-4" />
            Connect GitHub
          </button>
        ) : onRetry ? (
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
};
