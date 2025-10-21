import useQueryFetchGithubOAuthLink from '../../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { useMutateRegisterInitEmail } from '../../hooks/useMutateRegisterInitEmail';
import { useRegisterInitForm } from '../../hooks/useRegisterForm';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface RegisterFormProps {
  isRegisterPending?: boolean;
}

const RegisterForm = ({ isRegisterPending = false }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { email, password, setEmail, setPassword, isValid, resetForm } =
    useRegisterInitForm();
  const registerInitMutation = useMutateRegisterInitEmail();
  const githubAuthorizeQuery = useQueryFetchGithubOAuthLink('register');
  const [showValidationError, setShowValidationError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isValid) {
      registerInitMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            resetForm();
            setShowValidationError(false);
          },
        }
      );
    } else {
      setShowValidationError(true);
    }
  };

  const passwordChecks = [
    {
      label: 'At least 8 characters',
      test: (pw: string) => pw.length >= 8,
    },
    {
      label: 'One uppercase letter',
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: 'One lowercase letter',
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      label: 'One number',
      test: (pw: string) => /[0-9]/.test(pw),
    },
    {
      label: 'One special character',
      test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
  ];

  const handleGithubSignup = async () => {
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
      console.error('Failed to initiate GitHub register:', error);
      setIsConnecting(false);
    }
  };

  const isPending = isRegisterPending || registerInitMutation.isPending;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
            disabled={isPending}
            className="w-full rounded-lg border border-[var(--color-accent)]/30 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
            disabled={isPending}
            className="w-full rounded-lg border border-[var(--color-accent)]/30 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="mt-4 flex flex-col gap-2">
            {passwordChecks.map(({ label, test }) => {
              const valid = test(password);
              return (
                <div key={label} className="flex items-center gap-2 text-sm">
                  {valid ? (
                    <CheckIcon className="h-4 w-4 text-[var(--color-accent)]" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-[var(--color-danger)]" />
                  )}
                  <span
                    className={
                      valid
                        ? 'text-[var(--color-accent)] line-through'
                        : 'text-[var(--color-danger)]'
                    }
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          {showValidationError && (
            <p className="mt-4 text-sm text-[var(--color-danger)]">
              Please enter a valid email and password.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || !isValid}
          aria-busy={isPending}
          className="hover:bg-opacity-90 w-full rounded-lg bg-[var(--color-primary)] py-4 text-base font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Registering...' : 'Create Account'}
        </button>

        <div className="my-2 flex items-center gap-4">
          <div className="h-px flex-grow border-t"></div>
          <span className="text-sm text-[var(--color-accent)]">
            or sign up with
          </span>
          <div className="h-px flex-grow border-t"></div>
        </div>

        <button
          type="button"
          onClick={handleGithubSignup}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--color-accent)]/30 bg-transparent py-4 text-base font-medium text-[var(--color-fg)] transition-all hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 disabled:cursor-not-allowed disabled:opacity-50"
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

        <div className="mt-4 text-center">
          <p className="text-sm text-[var(--color-accent)]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              disabled={isPending}
              className="font-semibold text-[var(--color-primary)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
