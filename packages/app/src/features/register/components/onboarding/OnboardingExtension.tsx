import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface OnboardingExtensionProps {
  onNext: () => void;
}

const OnboardingExtension = ({ onNext }: OnboardingExtensionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText('ext install iancardona.dev-dashboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-none">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] p-5">
          <h3 className="mb-3 text-base font-semibold text-[var(--color-fg)]">
            Option 1: Install from VS Code
          </h3>
          <ol className="mb-4 space-y-2 text-sm text-[var(--color-accent)]">
            <li>1. Open Extensions in VS Code (Ctrl+Shift+X)</li>
            <li>2. Search for "DevDashboard"</li>
            <li>3. Click Install</li>
          </ol>

          <a
            href="https://marketplace.visualstudio.com/items?itemName=iancardona.dev-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] transition-all hover:opacity-80"
          >
            View on Marketplace
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] p-5">
          <h3 className="mb-3 text-base font-semibold text-[var(--color-fg)]">
            Option 2: Install via Command
          </h3>
          <ol className="mb-4 space-y-2 text-sm text-[var(--color-accent)]">
            <li>1. Open Quick Open in VS Code (Ctrl+P)</li>
            <li>2. Paste the command below</li>
            <li>3. Press Enter</li>
          </ol>
          <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] p-3">
            <code className="block font-mono text-sm whitespace-nowrap text-[var(--color-fg)]">
              ext install iancardona.dev-dashboard
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

      <div className="mt-6">
        <button
          onClick={onNext}
          className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-6 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OnboardingExtension;
