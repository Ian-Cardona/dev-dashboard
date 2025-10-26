import { IGithubIntegrationRepository } from './interfaces/igithub.repository';
import { GithubRepository, GithubWorkflow } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';

export const GithubIntegrationRepository = (): IGithubIntegrationRepository => {
  const userAgent = ENV.APP_NAME || 'dev-dashboard';

  return {
    async listUserRepositories(username: string): Promise<GithubRepository[]> {
      const baseUrl = ENV.GITHUB_BASE_URL;
      const params = new URLSearchParams({ per_page: '100', sort: 'updated' });
      const url = `${baseUrl}/users/${username}/repos?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': userAgent,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `GitHub API failed (status ${response.status}): ${
            errorData.message || errorData.error || response.statusText
          }`
        );
      }

      const data = await response.json();
      return data;
    },

    async getRepository(
      owner: string,
      repo: string
    ): Promise<GithubRepository> {
      const baseUrl = ENV.GITHUB_BASE_URL;
      const url = `${baseUrl}/repos/${owner}/${repo}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': userAgent,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `GitHub API failed (status ${response.status}): ${
            errorData.message || errorData.error || response.statusText
          }`
        );
      }

      const data = await response.json();
      return data;
    },

    async getLatestWorkflowRun(
      owner: string,
      repo: string,
      branch?: string
    ): Promise<GithubWorkflow> {
      const baseUrl = ENV.GITHUB_BASE_URL;
      const params = new URLSearchParams({ per_page: '1' });
      if (branch) {
        params.append('branch', branch);
      }
      const url = `${baseUrl}/repos/${owner}/${repo}/actions/runs?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': userAgent,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `GitHub API failed (status ${response.status}): ${
            errorData.message || errorData.error || response.statusText
          }`
        );
      }

      const data = await response.json();
      return data.workflow_runs?.[0] ?? null;
    },
  };
};
