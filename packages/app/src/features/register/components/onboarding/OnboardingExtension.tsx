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
    <div className="w-full max-w-none">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] p-5">
          <h3 className="mb-3 text-base font-semibold text-[var(--color-fg)]">
            Marketplace
          </h3>
          <ol className="mb-4 space-y-2 text-sm text-[var(--color-accent)]">
            <li>1. Open Extensions (Ctrl+Shift+X)</li>
            <li>2. Search "DevDashboard"</li>
            <li>3. Click Install</li>
          </ol>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=devdashboard.extension"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] transition-all hover:opacity-80"
          >
            Open Marketplace
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] p-5">
          <h3 className="mb-3 text-base font-semibold text-[var(--color-fg)]">
            Command
          </h3>
          <div className="mb-4 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] p-3">
            <code className="font-mono text-sm text-[var(--color-fg)]">
              ext install devdashboard.extension
            </code>
          </div>
          <button
            onClick={handleCopyCommand}
            className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-fg)] transition-all duration-200 outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          >
            {copied ? 'Copied!' : 'Copy Command'}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <button
          onClick={onNext}
          className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-6 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        >
          Continue
        </button>
        <button
          onClick={onNext}
          className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-6 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none hover:border-[var(--color-accent)]/40 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default OnboardingExtension;
