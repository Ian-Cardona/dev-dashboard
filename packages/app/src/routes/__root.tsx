import CustomToast from '../components/ui/toasts/CustomToast';
import { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';

type RouterContext = {
  queryClient: QueryClient;
};

const GlobalLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
    <div className="text-center">
      <img
        src="/devdashboard.svg"
        alt="Loading"
        className="mx-auto h-12 w-12 animate-pulse"
      />
      <p className="mt-4 text-sm text-[var(--color-fg)]">Loading...</p>
    </div>
  </div>
);

const NavigationProgress = () => {
  const isLoading = useRouterState({ select: s => s.status === 'pending' });

  return isLoading ? (
    <div className="fixed top-0 right-0 left-0 z-50 h-1 animate-pulse bg-[var(--color-primary)]" />
  ) : null;
};

const ErrorFallback = ({ error }: { error: Error }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-md text-center">
        <img
          src="/devdashboard.svg"
          alt="DevDB Logo"
          className="mx-auto mb-4 h-12 w-12 opacity-50"
        />
        <h1 className="mb-2 text-2xl font-semibold text-[var(--color-fg)]">
          Something went wrong
        </h1>
        <p className="mb-6 text-[var(--color-accent)]">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate({ to: '/todos/pending' })}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white transition-opacity hover:opacity-90"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-4 py-2 text-[var(--color-fg)] transition-opacity hover:opacity-90"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
    <div className="w-full max-w-md text-center">
      <img
        src="/devdashboard.svg"
        alt="DevDB Logo"
        className="mx-auto mb-4 h-12 w-12 opacity-50"
      />
      <h1 className="mb-2 text-6xl font-bold text-[var(--color-fg)]">404</h1>
      <p className="mb-6 text-[var(--color-accent)]">Page not found</p>

      <a
        href="/todos/pending"
        className="inline-block rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white transition-opacity hover:opacity-90"
      >
        Go to dashboard
      </a>
    </div>
  </div>
);

const RootComponent = () => {
  return (
    <>
      <NavigationProgress />
      <Outlet />
      <CustomToast />
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  pendingComponent: GlobalLoader,
  errorComponent: ErrorFallback,
  notFoundComponent: NotFound,
});
