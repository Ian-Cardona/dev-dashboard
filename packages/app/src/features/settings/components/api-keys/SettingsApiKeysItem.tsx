import ConfirmModal from '../../../../components/ui/modals/ConfirmModal';
import { useMutateRevokeKey } from '../../hooks/useMutateRevokeKey';
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';

type SettingsApiKeysItemProps = {
  id: string;
  description?: string;
  createdAt: string;
};

const SettingsApiKeysItem = ({
  id,
  description,
  createdAt,
}: SettingsApiKeysItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const revokeKey = useMutateRevokeKey();
  const queryClient = useQueryClient();

  const isRevoking = revokeKey.isPending;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Created today';
      }
      if (diffDays === 1) {
        return 'Created yesterday';
      }
      if (diffDays < 7) {
        return `Created ${diffDays} days ago`;
      }

      return `Created ${date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}`;
    } catch {
      return `Created ${dateString}`;
    }
  };

  const handleRevokeClick = () => {
    setShowMenu(false);
    setShowConfirm(true);
  };

  const handleConfirmRevoke = () => {
    revokeKey.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['api-keys', 'list'] });
        setShowConfirm(false);
      },
      onError: error => {
        console.error('Failed to revoke API key:', error);
        setShowConfirm(false);
      },
    });
  };

  return (
    <>
      <li className="group rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-start gap-4">
            <div className="flex flex-1 flex-col">
              <h4 className="mb-2 text-lg font-bold text-[var(--color-fg)]">
                {description || 'Untitled Key'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-[var(--color-accent)]">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg border border-[var(--color-accent)]/20 p-2 text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
              aria-label={`Manage ${description || 'Untitled Key'}`}
              disabled={isRevoking}
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 z-10 mt-2 w-48 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] shadow-lg">
                <button
                  type="button"
                  onClick={handleRevokeClick}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <TrashIcon className="h-4 w-4" />
                  Revoke Key
                </button>
              </div>
            )}
          </div>
        </div>
      </li>

      {showConfirm && (
        <ConfirmModal
          title="Revoke API Key"
          message={`Are you sure you want to revoke "${description || 'Untitled Key'}"? This action cannot be undone and any applications using this key will immediately lose access.`}
          onConfirm={handleConfirmRevoke}
          onCancel={() => setShowConfirm(false)}
          confirmText={isRevoking ? 'Revoking...' : 'Revoke Key'}
          cancelText="Cancel"
          confirmVariant="danger"
        />
      )}
    </>
  );
};

export default SettingsApiKeysItem;
