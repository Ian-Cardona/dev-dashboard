import useQueryFetchGithubOAuthLink from '../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { useLoginForm } from '../hooks/useLoginForm';
import { useMutateLoginEmail } from '../hooks/useMutateLoginEmail';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface LoginFormProps {
  isLoginPending?: boolean;
}

const LoginForm = ({ isLoginPending = false }: LoginFormProps) => {
  const navigate = useNavigate();
  const { email, password, setEmail, setPassword, isValid, resetForm } =
    useLoginForm();
  const mutateLoginEmail = useMutateLoginEmail();
  const githubAuthorizeQuery = useQueryFetchGithubOAuthLink('login');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleGithubLoginClick = async () => {
    setIsConnecting(true);
    try {
      const response = await githubAuthorizeQuery.refetch();
      const url = response?.data?.authorize_uri;

      if (!url) {
        console.error('GitHub authorize URL not found');
        setIsConnecting(false);
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error('Failed to initiate GitHub login:', error);
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      mutateLoginEmail.mutate(
        { email, password },
        {
          onSuccess: () => {
            resetForm();
            navigate('/');
          },
        }
      );
    }
  };

  if (isLoginPending) {
    return (
      <div className="w-full py-10 text-center text-[var(--color-accent)]">
        Logging in with OAuth...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-fg)]">
          Log in
        </h1>
        <p className="text-base text-[var(--color-accent)]">
          Welcome back to your workspace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[var(--color-fg)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={mutateLoginEmail.isPending}
            className="w-full rounded-lg border border-[var(--color-accent)]/30 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!isValid}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[var(--color-fg)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={mutateLoginEmail.isPending}
            className="w-full rounded-lg border border-[var(--color-accent)]/30 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!isValid}
          />
        </div>

        <button
          type="submit"
          disabled={mutateLoginEmail.isPending || !isValid}
          className="hover:bg-opacity-90 w-full rounded-lg bg-[var(--color-primary)] py-4 text-base font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={mutateLoginEmail.isPending}
        >
          {mutateLoginEmail.isPending ? 'Logging in...' : 'Log in'}
        </button>

        <div className="my-2 flex items-center gap-4">
          <div className="h-px flex-grow border-t"></div>
          <span className="text-sm text-[var(--color-accent)]">
            or log in with
          </span>
          <div className="h-px flex-grow border-t"></div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--color-accent)]/30 bg-transparent py-4 text-base font-medium text-[var(--color-fg)] transition-all hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleGithubLoginClick}
          disabled={isConnecting}
          aria-busy={isConnecting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          {isConnecting ? 'Connecting...' : 'GitHub'}
        </button>
        {githubAuthorizeQuery.isError && (
          <div className="mt-2 text-center text-sm text-red-500" role="alert">
            Could not retrieve GitHub login link. Please try again later.
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-[var(--color-accent)]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              disabled={mutateLoginEmail.isPending}
              className="font-semibold text-[var(--color-primary)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
