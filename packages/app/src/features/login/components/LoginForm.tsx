import GithubSvg from '../../../components/ui/svg/GithubSvg';
import useQueryFetchGithubOAuthLink from '../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { useLoginForm } from '../hooks/useLoginForm';
import { useMutateLoginEmail } from '../hooks/useMutateLoginEmail';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface LoginFormProps {
  isLoginPending?: boolean;
  onError: (error: string | null) => void;
  onSuccess?: () => void;
}

const LoginForm = ({
  isLoginPending = false,
  onError,
  onSuccess,
}: LoginFormProps) => {
  const navigate = useNavigate();
  const { email, password, setEmail, setPassword, isValid } = useLoginForm();
  const loginEmailMutation = useMutateLoginEmail();
  const githubAuthorizeQuery = useQueryFetchGithubOAuthLink('login');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!loginEmailMutation.error) {
      return;
    }

    let message = 'Login failed. Please try again.';

    const error = loginEmailMutation.error as AxiosError<{
      message?: string;
      error?: string;
    }>;

    message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      message;

    onError(message);
  }, [loginEmailMutation.error, onError]);

  useEffect(() => {
    if (loginEmailMutation.isSuccess && onSuccess) {
      onSuccess();
    }
  }, [loginEmailMutation.isSuccess, onSuccess]);

  const handleGithubLoginClick = async (): Promise<void> => {
    setIsConnecting(true);
    onError(null);

    try {
      const response = await githubAuthorizeQuery.refetch();
      const url = response?.data?.authorize_uri;

      if (!url || typeof url !== 'string') {
        onError('GitHub authorize URL not found. Please try again.');
        setIsConnecting(false);
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error('GitHub login error:', error);
      onError('Failed to initiate GitHub login. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!isValid) return;

    onError(null);
    loginEmailMutation.mutate({ email, password });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (loginEmailMutation.error) {
      onError(null);
    }
    setEmail(e.target.value);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (loginEmailMutation.error) {
      onError(null);
    }
    setPassword(e.target.value);
  };

  const handleNavigateToRegister = (): void => {
    navigate({
      to: '/register',
    });
  };

  const isLoading = isLoginPending || loginEmailMutation.isPending;

  return (
    <div className="w-full max-w-none">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <button
          type="button"
          onClick={handleGithubLoginClick}
          disabled={isConnecting || isLoading}
          className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-6 py-4 text-base text-[var(--color-fg)] transition-all duration-200 outline-none hover:border-[var(--github-blue)] hover:bg-[var(--github-blue)] hover:text-white focus:border-[var(--github-blue)] focus:ring-2 focus:ring-[var(--github-blue)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isConnecting}
        >
          <div className="flex items-center justify-center gap-3">
            <GithubSvg className="h-5 w-5 transition-colors duration-200" />
            <span>
              {isConnecting ? 'Connecting...' : 'Continue with GitHub'}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-grow border-t border-[var(--color-accent)]/20"></div>
          <span className="text-sm text-[var(--color-accent)]">or</span>
          <div className="h-px flex-grow border-t border-[var(--color-accent)]/20"></div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--color-fg)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!isValid}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[var(--color-fg)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!isValid}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-6 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="mt-2 text-center">
          <p className="text-sm text-[var(--color-accent)]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleNavigateToRegister}
              disabled={isLoading}
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
