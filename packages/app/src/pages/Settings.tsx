import SettingsAccount from '../features/settings/components/account/SettingsAccount';
import SettingsApiKeys from '../features/settings/components/api-keys/SettingsApiKeys';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router';

const SettingsPage = () => {
  const location = useLocation();

  const currentTab = location.pathname.split('/').pop() || 'profile';

  const getTabClass = (tabName: string) => {
    return `px-4 py-2 text-lg font-medium transition-colors duration-200 ${
      currentTab === tabName
        ? 'border-b-2 border-l-4 border-[var(--color-primary)] text-[var(--color-primary)]'
        : 'border-b-2 border-l-4 border-transparent'
    }`;
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'account':
        return <SettingsAccount />;
      case 'api-keys':
        return <SettingsApiKeys />;
      default:
        return <SettingsAccount />;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-bg)] p-8">
      <header className="mb-4 flex flex-shrink-0 items-center gap-2">
        <Cog6ToothIcon className="h-8 w-8" />
        <h1 className="text-4xl">Settings</h1>
      </header>
      <div className="mb-4 flex">
        <Link to="/settings/account" className={getTabClass('account')}>
          Profile
        </Link>
        <Link to="/settings/api-keys" className={getTabClass('api-keys')}>
          API Keys
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
