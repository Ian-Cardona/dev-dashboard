import { useMutateRegisterEmail } from '../../hooks/useMutateRegisterEmail';
import { useMutateRegisterOauth } from '../../hooks/useMutateRegisterOauth';
import { type FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router';

interface OnboardingFormProps {
  email?: string;
}

const OnboardingForm = ({ email: emailProp }: OnboardingFormProps) => {
  const [searchParams] = useSearchParams();
  const flow = searchParams.get('flow');

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

    registerMutation.mutate(
      { email, firstName, lastName },
      {
        onSuccess: () => {
          console.log('Registration complete');
        },
        onError: err => {
          console.error('Failed to complete registration:', err);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-8 rounded-4xl border bg-[var(--color-surface)] p-12 shadow-lg transition-all duration-300"
    >
      <header className="text-center">
        <h2 className="mb-3 text-4xl font-bold text-[var(--color-fg)]">
          Complete Your Setup
        </h2>
        <p className="text-base text-[var(--color-accent)]">
          Provide a few details to finish registration.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[var(--color-fg)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={flow === 'email'}
            className="w-full rounded-lg border border-[var(--color-accent)]/40 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-accent)]/70 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-bg)]/50 disabled:text-[var(--color-accent)]"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-[var(--color-fg)]"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-accent)]/40 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-accent)]/70 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
            placeholder="Enter your first name"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-[var(--color-fg)]"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-accent)]/40 bg-transparent p-4 text-base text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-accent)]/70 hover:border-[var(--color-primary)]/60 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || registerMutation.isPending}
        className="hover:bg-opacity-90 w-full rounded-lg bg-[var(--color-primary)] py-4 text-base font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {registerMutation.isPending ? 'Loading...' : 'Continue'}
      </button>
    </form>
  );
};

export default OnboardingForm;
