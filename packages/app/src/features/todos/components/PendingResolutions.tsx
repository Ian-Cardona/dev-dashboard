import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import ResolutionsTable from './resolutions/ResolutionsTable';
import { useState } from 'react';

const PendingResolutions = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState<boolean>(false);
  return (
    <section className="rounded-4xl border pt-8 h-full flex flex-col bg-[var(--color-surface)]">
      <div className="flex items-center justify-between mb-8 px-8">
        <h2 className="flex items-center text-3xl">
          Pending Resolutions
          <div className="relative ml-3">
            <QuestionMarkCircleIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => setIsToolbarOpen(!isToolbarOpen)}
            />
            {isToolbarOpen && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 p-4 bg-[var(--color-surface)] border rounded-4xl shadow-lg z-10">
                <p className="text-sm font-normal text-left">
                  Pending resolutions are TODOs that need your input. Use Edit
                  mode to assign reasons or resolve them.
                </p>
              </div>
            )}
          </div>
        </h2>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="border rounded-4xl px-4 py-2 text-sm hover:bg-[var(--color-primary)]"
        >
          {isEditMode ? 'Submit' : 'Edit'}
        </button>
      </div>
      <div className="flex-1 overflow-hidden rounded-b-4xl">
        <div className="overflow-y-auto h-full">
          <ResolutionsTable isEditMode={isEditMode} />
        </div>
      </div>
    </section>
  );
};

export default PendingResolutions;
