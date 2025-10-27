export interface IGithubIntegrationService {
  listUserRepositories(username: string): Promise<unknown[]>;
  getLatestWorkflowRun(
    owner: string,
    repo: string,
    branch?: string
  ): Promise<unknown | null>;
}
