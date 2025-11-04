import { IGithubIntegrationRepository } from './interfaces/igithub.repository';
import {
  GithubErrorResponse,
  GithubNotification,
  GithubRepository,
  GithubWorkflow,
  GithubWorkflowRunsResponse,
  GithubWorkflowResponse,
  GithubNotificationResponse,
} from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';

export const GithubIntegrationRepository = (): IGithubIntegrationRepository => {
  const userAgent = ENV.APP_NAME;
  const baseUrl = ENV.GITHUB_BASE_URL;

  const buildUrl = (path: string, params?: Record<string, string>): string => {
    const url = `${baseUrl}${path}`;
    if (!params) return url;

    const searchParams = new URLSearchParams(params);
    return `${url}?${searchParams.toString()}`;
  };

  const githubFetch = async <T>(url: string, token: string): Promise<T> => {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': userAgent,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    } as const;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch((): GithubErrorResponse => ({}));

      throw new Error(
        `GitHub API failed (status ${response.status}): ${
          errorData.message || errorData.error || response.statusText
        }`
      );
    }

    return response.json();
  };

  return {
    async getUserRepositories(
      accessToken: string
    ): Promise<GithubRepository[]> {
      const url = buildUrl('/user/repos', {
        per_page: '100',
        sort: 'updated',
      });
      return githubFetch<GithubRepository[]>(url, accessToken);
    },

    async getLatestWorkflowRun(
      data: GithubWorkflow
    ): Promise<GithubWorkflowResponse | null> {
      const params: Record<string, string> = { per_page: '1', page: '1' };

      const url = buildUrl(
        `/repos/${data.owner}/${data.repo}/actions/runs`,
        params
      );

      const response = await githubFetch<GithubWorkflowRunsResponse>(
        url,
        data.access_token
      );

      if (!response.workflow_runs || response.workflow_runs.length === 0) {
        return null;
      }

      return response.workflow_runs[0];
    },

    async getUserNotifications(
      data: GithubNotification
    ): Promise<GithubNotificationResponse[]> {
      const params: Record<string, string> = {
        all: data.all.toString(),
        participating: data.participating.toString(),
        per_page: data.per_page.toString(),
      };

      const url = buildUrl('/notifications', params);

      return githubFetch<GithubNotificationResponse[]>(url, data.access_token);
    },
  };
};
