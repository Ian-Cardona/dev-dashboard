import GithubLatestWorkflowRun from './GithubLatestWorkflowRun';
import GithubNotifications from './GithubNotifications';

const GithubIntegrations = () => {
  return (
    <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="flex items-center text-3xl">Github</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-8 overflow-auto rounded-b-4xl px-8 pb-8">
        <GithubLatestWorkflowRun />
        <GithubNotifications />
      </div>
    </section>
  );
};

export default GithubIntegrations;
