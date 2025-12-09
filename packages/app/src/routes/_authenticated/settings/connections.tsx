import ErrorModal from '../../../components/ui/modals/ErrorModal';
import GithubSvg from '../../../components/ui/svg/GithubSvg';
import { useQueryFetchProviders } from '../../../features/settings/hooks/useQueryFetchProviders';
import { useToast } from '../../../hooks/useToast';
import { getOAuthLinkCookieKeys } from '../../../lib/configs/getConfig';
import { queryClient } from '../../../lib/tanstack/queryClient';
import useQueryFetchGithubOAuthLink from '../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { getAndClearCookieValue } from '../../../utils/document/getAndClearCookieValue';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const SettingsConnections = () => {
  const { data: providers = [] } = useQueryFetchProviders();
  const githubAuthorizeQuery = useQueryFetchGithubOAuthLink('link');
  const oauthLinkCookieKeys = getOAuthLinkCookieKeys();
  const toast = useToast();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const githubProvider = providers.find(p => p.provider === 'github');

  useEffect(() => {
    const oauthError = getAndClearCookieValue(oauthLinkCookieKeys.error);
    const oauthSuccess = getAndClearCookieValue(oauthLinkCookieKeys.success);

    if (oauthError) {
      const errorMessages: Record<string, string> = {
        not_found: 'User not found. Please try again.',
        github_already_linked:
          'This GitHub account is already linked to another user.',
        link_failed: 'Failed to link GitHub account. Please try again.',
      };
      setErrorMessage(
        errorMessages[oauthError] ||
          'An error occurred during GitHub connection.'
      );
      setShowErrorModal(true);
    }

    if (oauthSuccess) {
      const successMessages: Record<string, string> = {
        github_connected: 'GitHub account successfully connected!',
      };
      toast.showSuccess(successMessages[oauthSuccess] || 'Success!');
      queryClient.invalidateQueries({ queryKey: ['connections', 'list'] });
    }
  }, [toast]);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleConnectGitHub = async (): Promise<void> => {
    try {
      const response = await githubAuthorizeQuery.refetch();
      const url = response?.data?.authorize_uri;

      if (!url || typeof url !== 'string') {
        setErrorMessage('GitHub authorize URL not found. Please try again.');
        setShowErrorModal(true);
        return;
      }

      window.location.href = url;
    } catch (error) {
      console.error('GitHub connection error:', error);
      setErrorMessage(
        'Failed to initiate GitHub connection. Please try again.'
      );
      setShowErrorModal(true);
    }
  };

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-[var(--color-fg)]">
          Connections
        </h2>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          <p className="mb-6 text-sm text-[var(--color-accent)]">
            Connect your external services and integrations to enhance your
            workflow.
          </p>

          <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#333]/10">
                  <GithubSvg className="h-6 w-6 text-[#333]" />
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="text-lg font-bold text-[var(--color-fg)]">
                      GitHub
                    </h4>
                    {githubProvider && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                        Connected
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--color-accent)]">
                    Connect your GitHub account to sync repositories and
                    activities
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {githubProvider ? (
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#333] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#444]"
                  >
                    Open GitHub
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnectGitHub}
                    disabled={githubAuthorizeQuery.isFetching}
                    className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Connect GitHub"
                  >
                    {githubAuthorizeQuery.isFetching
                      ? 'Loading...'
                      : 'Connect GitHub'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showErrorModal && (
        <ErrorModal
          onClose={handleCloseErrorModal}
          title="Connection Error"
          message={errorMessage}
          closeText="Close"
        />
      )}
    </section>
  );
};

export const Route = createFileRoute('/_authenticated/settings/connections')({
  component: SettingsConnections,
});
