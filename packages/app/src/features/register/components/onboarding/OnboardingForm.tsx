import { useState, type FormEvent } from 'react';

interface OnboardingFormProps {
  email: string;
}

const OnboardingForm = ({ email }: OnboardingFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const isValid = firstName.trim() !== '' && lastName.trim() !== '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    console.log({ email, firstName, lastName });
    // TODO: Call your final registration mutation here
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
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-bg)]/50 p-4 text-base text-[var(--color-accent)] transition-all duration-200 focus:outline-none"
            placeholder="you@example.com"
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
        disabled={!isValid}
        className="hover:bg-opacity-90 w-full rounded-lg bg-[var(--color-primary)] py-4 text-base font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </form>
  );
};

export default OnboardingForm;
