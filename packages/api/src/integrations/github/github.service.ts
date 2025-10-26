import { IGithubIntegrationService } from './interfaces/igithub.service';

export const GithubIntegrationService = (): IGithubIntegrationService => {
  return {
    async listUserRepositories(accessToken) {},

    async getLatestWorkflowRun(accessToken, owner, repo, branch) {},
  };
};
