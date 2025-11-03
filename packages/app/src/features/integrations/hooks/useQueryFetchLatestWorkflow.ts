import { fetchGithubLatestWorkflow } from '../api/integrationsApi';
import { type GithubWorkflow } from '@dev-dashboard/shared';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchLatestWorkflow = (owner: string, repo: string) => {
  return useQuery<GithubWorkflow[]>({
    queryKey: ['workflows', owner, repo],
    queryFn: () => fetchGithubLatestWorkflow(owner, repo),
    enabled: !!owner && !!repo,
  });
};

export default useQueryFetchLatestWorkflow;
