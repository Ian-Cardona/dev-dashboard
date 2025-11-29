import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface OnboardingExtensionProps {
  onNext: () => void;
}

const OnboardingExtension = ({ onNext }: OnboardingExtensionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText('ext install devdashboard.extension');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-xl text-[var(--color-fg)]">
          VS Code Extension
        </h2>
        <p className="text-sm text-[var(--color-accent)]">
          Track activity and sync todos from your editor
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-5">
          <h3 className="mb-2 text-base font-semibold text-[var(--color-fg)]">
            Marketplace
          </h3>
          <ol className="mb-3 space-y-1 text-sm text-[var(--color-accent)]">
            <li>Extensions (Ctrl+Shift+X)</li>
            <li>Search "DevDashboard"</li>
            <li>Install</li>
          </ol>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=devdashboard.extension"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] transition-all hover:opacity-80"
          >
            Open
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-5">
          <h3 className="mb-2 text-base font-semibold text-[var(--color-fg)]">
            Command
          </h3>
          <div className="mb-3 rounded-lg bg-[var(--color-bg)] p-3">
            <code className="font-mono text-xs text-[var(--color-fg)]">
              ext install devdashboard.extension
            </code>
          </div>
          <button
            onClick={handleCopyCommand}
            className="text-sm text-[var(--color-primary)] transition-all hover:opacity-80"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onNext}
          className="w-full rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 sm:w-auto"
        >
          Continue
        </button>
        <button
          onClick={onNext}
          className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-accent)]/40 sm:w-auto"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default OnboardingExtension;
