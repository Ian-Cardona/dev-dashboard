import { useLoginForm, useLoginMutation } from '../../hooks';
import { useNavigate } from 'react-router';

const GithubIcon = () => (
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
);

const LoginForm = () => {
  const { email, password, setEmail, setPassword, isValid, resetForm } =
    useLoginForm();
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => resetForm(),
        }
      );
    }
  };

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
            className="w-full rounded-lg border border-[var(--color-accent)]/30 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
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
            className="w-full rounded-lg border border-[var(--color-accent)]/30 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending || !isValid}
          className="hover:bg-opacity-90 w-full rounded-lg bg-[var(--color-primary)] py-4 text-base font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Log in'}
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
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--color-accent)]/30 bg-transparent py-4 text-base font-medium text-[var(--color-fg)] transition-all hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5"
        >
          <GithubIcon />
          GitHub
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-[var(--color-accent)]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-semibold text-[var(--color-primary)] hover:underline"
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
