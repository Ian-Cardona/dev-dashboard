import GithubIntegrations from '../features/integrations/components/GithubIntegrations';
import { Link, useLocation } from 'react-router';

const IntegrationsPage = () => {
  const location = useLocation();

  const currentTab = location.pathname.split('/').pop() || 'github';

  const getTabClass = (tabName: string) => {
    return `px-4 py-2 text-lg font-medium transition-colors duration-200 ${
      currentTab === tabName
        ? 'border-b-2 border-l-4 border-[var(--color-primary)] text-[var(--color-primary)]'
        : 'border-b-2 border-l-4 border-transparent'
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
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-bg)] p-8">
      <header className="mb-4 flex flex-shrink-0 items-center gap-2">
        <h1 className="text-4xl">Integrations</h1>
      </header>

      <div className="mb-4 flex">
        <Link to="/integrations/github" className={getTabClass('github')}>
          GitHub
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default IntegrationsPage;
