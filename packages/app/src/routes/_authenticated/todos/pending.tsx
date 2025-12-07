import ConfirmModal from '../../../components/ui/modals/ConfirmModal';
import ResolutionsTable from '../../../features/todos/components/resolutions/ResolutionsTable';
import useMutateResolveTodos from '../../../features/todos/hooks/useMutateResolveTodos';
import useQueryPendingResolutions from '../../../features/todos/hooks/useQueryPendingResolutions';
import { type CreateResolution } from '@dev-dashboard/shared';
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type JSX, type ReactNode, useMemo, useState } from 'react';

type TypeFilter = '' | 'bug' | 'feature' | 'chore' | string;
type SortField = 'type' | 'content' | 'createdAt' | null;
type SortDirection = 'asc' | 'desc';
type SelectedReasons = Record<string, string>;

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const PendingResolutions = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { mutate } = useMutateResolveTodos({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos', 'resolutions', 'pending'],
      });
      queryClient.invalidateQueries({
        queryKey: ['todos', 'project'],
      });
      setSelectedReasons({});
      setIsEditMode(false);
      setShowConfirmSubmit(false);
    },
    onError: () => {
      setShowConfirmSubmit(false);
    },
  });

  const {
    data: resolutions,
    isLoading,
    isError,
  } = useQueryPendingResolutions();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [selectedReasons, setSelectedReasons] = useState<SelectedReasons>({});

  const handleReasonChange = (id: string, value: string): void => {
    setSelectedReasons((prev: SelectedReasons) => ({
      ...prev,
      [id]: value,
    }));
  };

  const uniqueTypes = useMemo(
    () => [...new Set(resolutions?.map(resolution => resolution.type) || [])],
    [resolutions]
  );

  const handleSort = (field: string): void => {
    if (field === 'type' || field === 'content' || field === 'createdAt') {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    }
  };

  const getSortIcon = (key: string): JSX.Element | null => {
    if (key !== 'type' && key !== 'content' && key !== 'createdAt') {
      return null;
    }
    const field = key as 'type' | 'content' | 'createdAt';
    if (sortField !== field) {
      return (
        <ChevronUpDownIcon
          className="inline-block h-4 w-4 text-[var(--color-accent)]"
          aria-hidden="true"
        />
      );
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon
        className="inline-block h-4 w-4 text-[var(--color-primary)]"
        aria-hidden="true"
      />
    ) : (
      <ChevronDownIcon
        className="inline-block h-4 w-4 text-[var(--color-primary)]"
        aria-hidden="true"
      />
    );
  };

  const filteredAndSortedResolutions = useMemo(() => {
    if (!resolutions) return [];

    let filtered = resolutions.filter(resolution => {
      const matchesType = !typeFilter || resolution.type === typeFilter;
      return matchesType;
    });

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case 'type':
            aValue = a.type;
            bValue = b.type;
            break;
          case 'content':
            aValue = a.content.toLowerCase();
            bValue = b.content.toLowerCase();
            break;
          case 'createdAt':
            aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [resolutions, typeFilter, sortField, sortDirection]);

  const selectedResolutionsCount = useMemo(() => {
    return Object.values(selectedReasons).filter(Boolean).length;
  }, [selectedReasons]);

  const handleSubmitClick = (): void => {
    setShowConfirmSubmit(true);
  };

  const handleSubmitConfirm = (): void => {
    if (!resolutions) return;

    const payload = resolutions
      .filter(resolution => selectedReasons[resolution.id])
      .map(resolution => ({
        id: resolution.id,
        syncId: resolution.syncId,
        reason: selectedReasons[resolution.id] as CreateResolution['reason'],
      }));

    mutate(payload);
  };

  const handleSubmitCancel = (): void => {
    setShowConfirmSubmit(false);
  };

  const hasValidSelection = useMemo(() => {
    if (!resolutions) return false;
    return resolutions.some(resolution => !!selectedReasons[resolution.id]);
  }, [resolutions, selectedReasons]);

  const handleDiscardConfirm = (): void => {
    setSelectedReasons({});
    setShowConfirmDiscard(false);
    setIsEditMode(false);
  };

  const handleDiscardCancel = (): void => {
    setShowConfirmDiscard(false);
  };

  const handleEditButtonClick = (): void => {
    if (isEditMode && Object.keys(selectedReasons).length > 0) {
      setShowConfirmDiscard(true);
    } else {
      setIsEditMode(!isEditMode);
    }
  };

  const emptyState: EmptyStateProps | null = useMemo(() => {
    if (isError) {
      return {
        icon: (
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-[var(--color-primary)]" />
        ),
        title: 'Failed to load resolutions',
        description:
          'There was an error loading pending resolutions. Please try again later.',
      };
    }
    if (isLoading) {
      return {
        icon: null,
        title: 'Loading resolutions...',
        description: 'Please wait while we fetch your pending resolutions.',
      };
    }
    if (!resolutions || resolutions.length === 0) {
      return {
        icon: (
          <CheckCircleIcon className="mx-auto h-12 w-12 text-[var(--color-accent)]" />
        ),
        title: 'No pending resolutions',
        description: 'Send TODOs from the VSCode extension to see here.',
      };
    }
    return null;
  }, [isError, isLoading, resolutions]);

  const hasData = !emptyState;

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="flex items-center text-2xl text-[var(--color-fg)]">
          Pending Resolutions
          <div className="relative ml-3">
            <InformationCircleIcon
              className="h-5 w-5 cursor-pointer text-[var(--color-accent)] transition-colors duration-200 hover:text-[var(--color-primary)]"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            />
            {isTooltipVisible && (
              <div className="absolute top-full left-1/2 z-10 mt-2 w-72 -translate-x-1/2 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-4">
                <p className="text-left text-sm font-normal text-[var(--color-fg)]">
                  Pending resolutions are TODOs that need your input. Use{' '}
                  <span className="text-[var(--color-primary)]">
                    Resolve mode
                  </span>{' '}
                  to assign reasons or resolve them.
                </p>
              </div>
            )}
          </div>
        </h2>
        {hasData && (
          <button
            onClick={handleEditButtonClick}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-4 py-2 text-sm transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            {isEditMode ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <CheckIcon className="h-5 w-5" />
            )}
            {isEditMode ? 'Cancel' : 'Resolve'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {emptyState ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              {emptyState.icon}
              <div className="mt-4 text-lg text-[var(--color-fg)]">
                {emptyState.title}
              </div>
              <div className="mt-2 text-sm text-[var(--color-accent)]">
                {emptyState.description}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <ResolutionsTable
              isEditMode={isEditMode}
              resolutions={filteredAndSortedResolutions}
              getSortIcon={getSortIcon}
              handleSort={handleSort}
              setTypeFilter={setTypeFilter}
              typeFilter={typeFilter}
              uniqueTypes={uniqueTypes}
              selectedReasons={selectedReasons}
              onReasonChange={handleReasonChange}
            />
          </div>
        )}
      </div>

      {isEditMode && hasData && (
        <div className="border-t border-[var(--color-accent)]/20 p-6">
          <div className="flex justify-center">
            <button
              onClick={handleSubmitClick}
              disabled={!hasValidSelection}
              className={`flex items-center gap-2 rounded-lg border px-5 py-3 text-base transition-all duration-200 ${
                !hasValidSelection
                  ? 'cursor-not-allowed border-[var(--color-accent)]/20 text-[var(--color-accent)] opacity-50'
                  : 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90'
              }`}
            >
              <CheckIcon className="h-5 w-5" />
              Submit Resolutions
            </button>
          </div>
        </div>
      )}

      {showConfirmDiscard && (
        <ConfirmModal
          title="Cancel Resolutions"
          message="Are you sure you want to cancel all your changes? This action cannot be undone."
          confirmText="Yes, Cancel"
          cancelText="Continue Editing"
          confirmVariant="danger"
          onConfirm={handleDiscardConfirm}
          onCancel={handleDiscardCancel}
        />
      )}

      {showConfirmSubmit && (
        <ConfirmModal
          title="Submit Resolutions"
          message={`Are you sure you want to submit ${selectedResolutionsCount} resolution${selectedResolutionsCount !== 1 ? 's' : ''}? This action cannot be undone.`}
          confirmText="Yes, Submit"
          cancelText="Cancel"
          confirmVariant="success"
          onConfirm={handleSubmitConfirm}
          onCancel={handleSubmitCancel}
        />
      )}
    </section>
  );
};

export const Route = createFileRoute('/_authenticated/todos/pending')({
  component: PendingResolutions,
});
