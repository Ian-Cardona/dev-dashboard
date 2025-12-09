import GithubSvg from '../../../../components/ui/svg/GithubSvg';
import useQueryFetchGithubOAuthLink from '../../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { useMutateRegisterInitEmail } from '../../hooks/useMutateRegisterInitEmail';
import { useRegisterInitForm } from '../../hooks/useRegisterForm';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface RegisterFormProps {
  onError?: (error: string | null) => void;
}

const PASSWORD_CHECKS = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw: string) => /[0-9]/.test(pw) },
  {
    label: 'One special character',
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
];

const RegisterForm = ({ onError }: RegisterFormProps) => {
  const navigate = useNavigate();
  const {
    email,
    password,
    confirmPassword,
    setEmail,
    setPassword,
    setConfirmPassword,
    isValid,
    passwordsMatch,
  } = useRegisterInitForm();

  const registerInitMutation = useMutateRegisterInitEmail();
  const githubAuthorizeQuery = useQueryFetchGithubOAuthLink('register');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!registerInitMutation.error) {
      onError?.(null);
      return;
    }

    let message = 'Registration failed. Please try again.';

    const error = registerInitMutation.error as AxiosError<{
      message?: string;
      error?: string;
    }>;

    message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      message;

    onError?.(message);
  }, [registerInitMutation.error, onError]);

  useEffect(() => {
    if (githubAuthorizeQuery.isError && !isConnecting) {
      onError?.(
        'Could not retrieve GitHub registration link. Please try again later.'
      );
    }
  }, [githubAuthorizeQuery.isError, isConnecting, onError]);

  const handleGithubRegisterClick = async (): Promise<void> => {
    setIsConnecting(true);
    onError?.(null);

    try {
      const response = await githubAuthorizeQuery.refetch();
      const url = response?.data?.authorize_uri;

      if (!url || typeof url !== 'string') {
        onError?.('GitHub authorize URL not found. Please try again.');
        setIsConnecting(false);
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error('GitHub registration error:', error);
      onError?.('Failed to initiate GitHub registration. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!isValid) return;

    onError?.(null);
    registerInitMutation.mutate({ email, password });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (registerInitMutation.error) {
      onError?.(null);
    }
    setEmail(e.target.value);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (registerInitMutation.error) {
      onError?.(null);
    }
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (registerInitMutation.error) {
      onError?.(null);
    }
    setConfirmPassword(e.target.value);
  };

  const handleNavigateToLogin = (): void => {
    navigate({ to: '/login' });
  };

  const isLoading = registerInitMutation.isPending;

  return (
    <div className="w-full max-w-none">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <button
          type="button"
          onClick={handleGithubRegisterClick}
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

        <div className="space-y-6">
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

            <div className="mt-4 flex flex-col gap-2">
              {PASSWORD_CHECKS.map(({ label, test }) => {
                const isCheckValid = test(password);
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm transition-all duration-200"
                  >
                    {isCheckValid ? (
                      <CheckIcon className="h-4 w-4 text-green-600 transition-colors duration-200" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 text-[var(--color-accent)] transition-colors duration-200" />
                    )}
                    <span
                      className={
                        isCheckValid
                          ? 'text-green-600 transition-all duration-200'
                          : 'text-[var(--color-accent)] transition-all duration-200'
                      }
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--color-fg)]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={!passwordsMatch && confirmPassword.length > 0}
            />
            {!passwordsMatch && confirmPassword.length > 0 && (
              <p className="mt-2 text-sm text-red-600">
                Passwords do not match
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-6 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>

        <div className="mt-2 text-center">
          <p className="text-sm text-[var(--color-accent)]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleNavigateToLogin}
              disabled={isLoading}
              className="font-semibold text-[var(--color-primary)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
