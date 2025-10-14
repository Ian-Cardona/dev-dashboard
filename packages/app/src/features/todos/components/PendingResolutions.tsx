import ConfirmModal from '../../../components/ui/ConfirmModal';
import useMutateResolveTodos from '../hooks/useMutateResolveTodos';
import useQueryPendingResolutions from '../hooks/useQueryPendingResolutions';
import ResolutionsTable from './resolutions/ResolutionsTable';
import { type CreateResolution } from '@dev-dashboard/shared';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { type JSX, useMemo, useState } from 'react';

type TypeFilter = '' | 'bug' | 'feature' | 'chore' | string;
type SortField = 'type' | 'content' | 'createdAt' | null;
type SortDirection = 'asc' | 'desc';
type SelectedReasons = Record<string, string>;

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
          className="inline-block h-4 w-4"
          aria-hidden="true"
        />
      );
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="inline-block h-4 w-4" aria-hidden="true" />
    ) : (
      <ChevronDownIcon className="inline-block h-4 w-4" aria-hidden="true" />
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

  const handleDiscardConfirm = () => {
    setSelectedReasons({});
    setShowConfirmDiscard(false);
    setIsEditMode(false);
  };

  const handleDiscardCancel = () => {
    setShowConfirmDiscard(false);
  };

  const handleEditButtonClick = () => {
    if (isEditMode && Object.keys(selectedReasons).length > 0) {
      setShowConfirmDiscard(true);
    } else {
      setIsEditMode(!isEditMode);
    }
  };

  return (
    <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="flex items-center text-3xl">
          Pending Resolutions
          <div className="relative ml-3">
            <InformationCircleIcon
              className="h-6 w-6 cursor-pointer"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            />
            {isTooltipVisible && (
              <div className="absolute top-full left-1/2 z-10 mt-2 w-72 -translate-x-1/2 rounded-2xl border bg-[var(--color-surface)] p-4 shadow-lg">
                <p className="text-left text-sm font-normal">
                  Pending resolutions are TODOs that need your input. Use Edit
                  mode to assign reasons or resolve them.
                </p>
              </div>
            )}
          </div>
        </h2>
        <button
          onClick={handleEditButtonClick}
          className={`flex items-center gap-2 rounded-4xl border px-6 py-1 text-base font-medium shadow-md transition-all ${isEditMode ? 'group-hover:opacity-100 hover:border-[var(--color-primary)] hover:bg-red-600' : 'group-hover:opacity-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]'} hover:text-white`}
        >
          {isEditMode ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <PencilSquareIcon className="h-5 w-5" />
          )}
          {isEditMode ? 'Discard' : 'Edit'}
        </button>
      </div>
      <div className="flex-1 overflow-hidden rounded-b-4xl">
        <div className="h-full overflow-y-auto">
          <ResolutionsTable
            isEditMode={isEditMode}
            resolutions={filteredAndSortedResolutions}
            isLoading={isLoading}
            isError={isError}
            getSortIcon={getSortIcon}
            handleSort={handleSort}
            setTypeFilter={setTypeFilter}
            typeFilter={typeFilter}
            uniqueTypes={uniqueTypes}
            selectedReasons={selectedReasons}
            onReasonChange={handleReasonChange}
          />
        </div>
      </div>
      {isEditMode && resolutions && resolutions.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <button
            onClick={handleSubmitClick}
            disabled={!hasValidSelection}
            className={`flex items-center gap-2 rounded-4xl border bg-[var(--color-surface)] px-6 py-1 text-base font-medium shadow-md transition-all ${
              !hasValidSelection
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer group-hover:opacity-100 hover:border-green-600 hover:bg-green-600 hover:text-white'
            }`}
          >
            <CheckIcon className="h-6 w-6" />
            Submit
          </button>
        </div>
      )}

      {showConfirmDiscard && (
        <ConfirmModal
          title="Discard Changes"
          message="Are you sure you want to discard all your changes? This action cannot be undone."
          confirmText="Yes, Discard"
          cancelText="Cancel"
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

export default PendingResolutions;
