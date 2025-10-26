export interface IGithubIntegrationService {
  listUserRepositories(accessToken: string): Promise<unknown[]>;
  getLatestWorkflowRun(
    accessToken: string,
    owner: string,
    repo: string,
    branch?: string
  ): Promise<unknown | null>;
}
