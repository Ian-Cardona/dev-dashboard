import { ClockIcon } from '@heroicons/react/24/outline';
import ResolutionsTable from './resolutions/ResolutionsTable';

const PendingResolutions = () => {
  return (
    <section className="rounded-4xl border pt-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 px-8">
        <h2 className="flex items-center text-3xl">
          <ClockIcon className="w-7 h-7 mr-2" />
          Pending Resolutions
        </h2>
      </div>
      <ResolutionsTable />
    </section>
  );
};

export default PendingResolutions;
