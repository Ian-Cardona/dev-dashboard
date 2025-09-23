import { ClockIcon } from '@heroicons/react/24/outline';
import ResolutionsTable from './resolutions/ResolutionsTable';
import { useState } from 'react';

const PendingResolutions = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  return (
    <section className="rounded-4xl border pt-8 h-full flex flex-col bg-[var(--color-surface)]">
      <div className="flex items-center justify-between mb-8 px-8">
        <h2 className="flex items-center text-3xl">
          <ClockIcon className="w-7 h-7 mr-2" />
          Pending Resolutions
        </h2>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="border rounded-4xl px-4 py-2 text-sm hover:bg-[var(--color-primary)]"
        >
          {isEditMode ? 'Submit' : 'Edit'}
        </button>
      </div>
      <ResolutionsTable isEditMode={isEditMode} />
    </section>
  );
};

export default PendingResolutions;
