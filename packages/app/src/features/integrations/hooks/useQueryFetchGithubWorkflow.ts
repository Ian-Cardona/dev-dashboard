import { fetchGithubWorkflow } from '../api/integrationsApi';
import { type GithubWorkflowResponse } from '@dev-dashboard/shared';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchGithubWorkflow = (owner: string, repo: string) => {
  return useQuery<GithubWorkflowResponse[]>({
    queryKey: ['github', 'workflows', owner, repo],
    queryFn: () => fetchGithubWorkflow(owner, repo),
    enabled: !!owner && !!repo,
  });
};

export default useQueryFetchGithubWorkflow;
