import { IGithubIntegrationRepository } from './interfaces/igithub.repository';
import { IGithubIntegrationService } from './interfaces/igithub.service';
import { GithubRepository, GithubWorkflow } from '@dev-dashboard/shared';

export const GithubIntegrationService = (
  githubIntegrationRepository: IGithubIntegrationRepository
): IGithubIntegrationService => {
  return {
    async listUserRepositories(username: string): Promise<GithubRepository[]> {
      if (!username?.trim()) {
        throw new Error('Username is required');
      }

      try {
        return await githubIntegrationRepository.listUserRepositories(username);
      } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        throw error;
      }
    },

    async getLatestWorkflowRun(
      owner: string,
      repo: string,
      branch?: string
    ): Promise<GithubWorkflow | null> {
      if (!owner?.trim() || !repo?.trim()) {
        throw new Error('Owner and repository name are required');
      }

      try {
        return await githubIntegrationRepository.getLatestWorkflowRun(
          owner,
          repo,
          branch
        );
      } catch (error) {
        console.error('Error fetching latest GitHub workflow run:', error);
        throw error;
      }
    },
  };
};
