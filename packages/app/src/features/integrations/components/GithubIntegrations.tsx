import useQueryFetchGithubNotifications from '../hooks/useQueryFetchGithubNotifications';
import GithubLatestWorkflowRun from './GithubLatestWorkflowRun';
import GithubNotifications from './GithubNotifications';
import { BellIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

const GithubIntegrations = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQueryFetchGithubNotifications();

  const unreadCount = notifications?.filter(n => n.unread)?.length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="flex items-center text-2xl font-bold text-[var(--color-fg)]">
          GitHub
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group relative flex items-center gap-3 rounded-lg border border-[var(--color-accent)]/20 px-5 py-3 text-base font-semibold transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            <BellIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <GithubNotifications
              notifications={notifications}
              isLoading={notificationsLoading}
              isError={notificationsError}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <GithubLatestWorkflowRun />
      </div>
    </section>
  );
};

export default GithubIntegrations;