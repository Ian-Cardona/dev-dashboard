import { useQueryFetchRepositories } from '../hooks/useQueryFetchRepositories';

const RepositoryList = () => {
  const {
    data: repositories,
    isLoading,
    isError,
  } = useQueryFetchRepositories();

  return (
    <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="flex items-center text-3xl">GitHub Repositories</h2>
      </div>
      <div className="flex-1 overflow-hidden rounded-b-4xl">
        <div className="h-full overflow-y-auto">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p>Loading repositories...</p>
            </div>
          )}
          {isError && (
            <div className="flex h-full items-center justify-center">
              <p className="text-red-600">Error loading repositories</p>
            </div>
          )}
          {repositories && repositories.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p>No repositories found</p>
            </div>
          )}
          {repositories && repositories.length > 0 && (
            <div className="px-8">
              {repositories.map((repo: any) => (
                <div key={repo.id} className="mb-4 rounded-2xl border p-4">
                  <h3 className="text-xl font-medium">{repo.name}</h3>
                  {repo.description && (
                    <p className="mt-2 text-sm">{repo.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RepositoryList;
