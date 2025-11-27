import SettingsAccount from '../features/settings/components/account/SettingsAccount';
import SettingsApiKeys from '../features/settings/components/api-keys/SettingsApiKeys';
import { UserCircleIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router';

const SettingsPage = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'account';

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
      case 'account':
        return <SettingsAccount />;
      case 'api-keys':
        return <SettingsApiKeys />;
      default:
        return <SettingsAccount />;
    }
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 flex-shrink-0 border-r border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
        <nav className="space-y-3">
          <Link to="/settings/account" className={getTabClass('account')}>
            <UserCircleIcon className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <Link to="/settings/api-keys" className={getTabClass('api-keys')}>
            <KeyIcon className="h-5 w-5" />
            <span>API Keys</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 overflow-hidden p-6">{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
