import GithubIntegrations from '../features/integrations/components/GithubIntegrations';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router';

const IntegrationsPage = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'github';

  const getTabClass = (tabName: string) => {
    const isActive = currentTab === tabName;
    return `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200 ${
      isActive
        ? 'border-l-4 border-l-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
        : 'border-[var(--color-accent)]/20 text-[var(--color-fg)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]'
    }`;
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'github':
        return <GithubIntegrations />;
      default:
        return <div>Select an integration tab.</div>;
    }
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 flex-shrink-0 border-r border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
        <nav className="space-y-3">
          <Link to="/integrations/github" className={getTabClass('github')}>
            <CodeBracketIcon className="h-5 w-5" />
            <span>GitHub</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 overflow-hidden p-6">{renderContent()}</div>
    </div>
  );
};

export default IntegrationsPage;
