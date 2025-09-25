import SettingsApiKeys from '../features/settings/components/api-keys/SettingsApiKeys';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const SettingsPage = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden p-8">
      <header className="mb-8 flex flex-shrink-0 items-center gap-3">
        <Cog6ToothIcon className="h-7 w-7" />
        <h1 className="text-4xl">Settings</h1>
      </header>
      <SettingsApiKeys />
    </div>
  );
};

export default SettingsPage;
