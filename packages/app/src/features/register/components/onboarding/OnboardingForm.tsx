import { useMutateRegisterEmail } from '../../hooks/useMutateRegisterEmail';
import { useMutateRegisterOauth } from '../../hooks/useMutateRegisterOauth';
import { useSearch } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';

interface OnboardingFormProps {
  email?: string;
}

const OnboardingForm = ({ email: emailProp }: OnboardingFormProps) => {
  const search = useSearch({ from: '/register/onboarding' });
  const flow = search.flow;

  const [email, setEmail] = useState(emailProp || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const isValid =
    email.trim() !== '' && firstName.trim() !== '' && lastName.trim() !== '';

  const registerMutation =
    flow === 'email' ? useMutateRegisterEmail() : useMutateRegisterOauth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    registerMutation.mutate({ email, firstName, lastName });
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-xl text-[var(--color-fg)]">Your Profile</h2>
        <p className="text-sm text-[var(--color-accent)]">
          Complete your account setup
        </p>
      </div>

      <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-fg)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={flow === 'email' || isLoading}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-[var(--color-fg)]"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Dev"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-[var(--color-fg)]"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Dashboard"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-busy={isLoading}
          >
            {isLoading ? 'Setting up...' : 'Complete'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;
