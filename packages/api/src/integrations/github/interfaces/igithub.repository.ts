import { GithubRepository, GithubWorkflow } from '@dev-dashboard/shared';

export interface IGithubIntegrationRepository {
  listUserRepositories(username: string): Promise<GithubRepository[]>;
  getRepository(owner: string, repository: string): Promise<GithubRepository>;
  getLatestWorkflowRun(
    owner: string,
    repo: string,
    branch?: string
  ): Promise<GithubWorkflow | null>;
}
