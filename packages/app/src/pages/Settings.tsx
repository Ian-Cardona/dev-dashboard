import SettingsAccount from '../features/settings/components/account/SettingsAccount';
import SettingsApiKeys from '../features/settings/components/api-keys/SettingsApiKeys';
import SettingsProfile from '../features/settings/components/profile/SettingsProfile';
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
      case 'profile':
        return (
          <div className="flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
            <SettingsProfile />
          </div>
        );
      case 'api-keys':
        return (
          <div className="flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
            <SettingsApiKeys />
          </div>
        );
      case 'account':
        return (
          <div className="flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
            <SettingsAccount />
          </div>
        );
      default:
        return (
          <div className="flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
            <SettingsProfile />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-background)] p-8">
      <header className="mb-4 flex flex-shrink-0 items-center gap-2">
        <Cog6ToothIcon className="h-8 w-8" />
        <h1 className="text-4xl">Settings</h1>
      </header>
      <div className="mb-4 flex">
        <Link to="/settings/profile" className={getTabClass('profile')}>
          Profile
        </Link>
        <Link to="/settings/api-keys" className={getTabClass('api-keys')}>
          API Keys
        </Link>
        <Link to="/settings/account" className={getTabClass('account')}>
          Account
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
