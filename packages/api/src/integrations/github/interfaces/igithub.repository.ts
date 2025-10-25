import { GithubRepository, GithubWorkflow } from '@dev-dashboard/shared';

export interface IGithubIntegrationRepository {
  listUserRepos(username: string): Promise<GithubRepository[]>;
  getRepo(owner: string, repo: string): Promise<GithubRepository>;
  getLatestWorkflowRun(
    owner: string,
    repo: string,
    branch?: string
  ): Promise<GithubWorkflow | null>;
}
