import {
  GithubNotification,
  GithubNotificationResponse,
  GithubRepository,
  GithubWorkflow,
  GithubWorkflowResponse,
} from '@dev-dashboard/shared';

export interface IGithubIntegrationRepository {
  getUserRepositories(accessToken: string): Promise<GithubRepository[]>;
  getLatestWorkflowRun(
    data: GithubWorkflow
  ): Promise<GithubWorkflowResponse | null>;
  getUserNotifications(
    data: GithubNotification
  ): Promise<GithubNotificationResponse[]>;
}
