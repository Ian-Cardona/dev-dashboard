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
    <div className="w-full max-w-none">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--color-fg)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={flow === 'email' || isLoading}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--color-fg)]">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={isLoading}
                placeholder="Dev"
                required
                className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--color-fg)]">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                disabled={isLoading}
                placeholder="Dashboard"
                required
                className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-6 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isLoading}
        >
          {isLoading ? 'Setting up...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );
};

export default OnboardingForm;
