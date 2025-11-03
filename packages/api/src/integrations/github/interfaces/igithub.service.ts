export interface IGithubIntegrationService {
  listUserRepositories(username: string): Promise<unknown[]>;
  getLatestWorkflowRun(
    accessToken: string,
    owner: string,
    repo: string
  ): Promise<unknown | null>;
}
