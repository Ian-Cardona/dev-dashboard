import { IGithubIntegrationRepository } from './interfaces/igithub.repository';
import { IGithubIntegrationService } from './interfaces/igithub.service';
import {
  GithubRepository,
  GithubWorkflow,
  GithubNotification,
  GithubWorkflowResponse,
  GithubNotificationResponse,
} from '@dev-dashboard/shared';
import { ExternalServiceError } from 'src/utils/errors.utils';

export const GithubIntegrationService = (
  githubIntegrationRepository: IGithubIntegrationRepository
): IGithubIntegrationService => {
  return {
    async getUserRepositories(
      accessToken: string
    ): Promise<GithubRepository[]> {
      try {
        return await githubIntegrationRepository.getUserRepositories(
          accessToken
        );
      } catch (error) {
        let errorMessage;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        throw new ExternalServiceError(
          `GitHub fetch user repositories failed ${errorMessage}`
        );
      }
    },

    async getLatestWorkflowRun(
      data: GithubWorkflow
    ): Promise<GithubWorkflowResponse | null> {
      try {
        return await githubIntegrationRepository.getLatestWorkflowRun(data);
      } catch (error) {
        let errorMessage;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        throw new ExternalServiceError(
          `GitHub fetch workflow runs failed ${errorMessage}`
        );
      }
    },

    async getUserNotifications(
      data: GithubNotification
    ): Promise<GithubNotificationResponse[]> {
      try {
        return await githubIntegrationRepository.getUserNotifications(data);
      } catch (error) {
        let errorMessage;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        throw new ExternalServiceError(
          `GitHub fetch user notifications failed ${errorMessage}`
        );
      }
    },
  };
};
