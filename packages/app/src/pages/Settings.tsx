import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import ApiKeysSettings from '../features/dashboard/settings/components/ApiKeysSettings';

const SettingsPage = () => {
  return (
    <div className="h-screen flex flex-col p-8 overflow-hidden">
      <header className="flex flex-shrink-0 items-center gap-3 mb-8">
        <Cog6ToothIcon className="h-7 w-7" />
        <h1 className="text-4xl">Settings</h1>
      </header>
      <ApiKeysSettings />
    </div>
  );
};

export default SettingsPage;
