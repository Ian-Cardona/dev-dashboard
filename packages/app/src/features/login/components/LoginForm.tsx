import GithubSvg from '../../../components/ui/svg/GithubSvg';
import useQueryFetchGithubOAuthLink from '../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { useLoginForm } from '../hooks/useLoginForm';
import { useMutateLoginEmail } from '../hooks/useMutateLoginEmail';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface LoginFormProps {
  isLoginPending?: boolean;
  onError: (error: string | null) => void;
}

const LoginForm = ({ isLoginPending = false, onError }: LoginFormProps) => {
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
    if (githubAuthorizeQuery.isError && !isConnecting) {
      onError('Could not retrieve GitHub login link. Please try again later.');
    }
  }, [githubAuthorizeQuery.isError, isConnecting, onError]);

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
    navigate('/register');
  };

  const isLoading = isLoginPending || loginEmailMutation.isPending;

  return (
    <div className="w-full max-w-none">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <button
          type="button"
          onClick={handleGithubLoginClick}
          disabled={isConnecting || isLoading}
          className="group flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--color-accent)]/20 px-6 py-3 text-base font-semibold text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--github-blue)] hover:bg-[var(--github-blue)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isConnecting}
        >
          <GithubSvg className="h-5 w-5 transition-colors duration-200 group-hover:text-white" />
          {isConnecting ? 'Connecting...' : 'GitHub'}
        </button>

        <div className="my-2 flex items-center gap-4">
          <div className="h-px flex-grow border-t border-[var(--color-accent)]/20"></div>
          <span className="text-sm text-[var(--color-accent)]">or</span>
          <div className="h-px flex-grow border-t border-[var(--color-accent)]/20"></div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[var(--color-fg)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={!isValid}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[var(--color-fg)]"
            >
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
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={!isValid}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="mt-4 text-center">
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
