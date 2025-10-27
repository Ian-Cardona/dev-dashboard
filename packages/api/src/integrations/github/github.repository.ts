import { IGithubIntegrationRepository } from './interfaces/igithub.repository';
import { GithubRepository, GithubWorkflow } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';

interface GithubErrorResponse {
  message?: string;
  error?: string;
}

interface GithubWorkflowRunsResponse {
  workflow_runs?: GithubWorkflow[];
}

export const GithubIntegrationRepository = (): IGithubIntegrationRepository => {
  const userAgent = ENV.APP_NAME;
  const baseUrl = ENV.GITHUB_BASE_URL;

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': userAgent,
  } as const;

  const buildUrl = (path: string, params?: Record<string, string>): string => {
    const url = `${baseUrl}${path}`;
    if (!params) return url;

    const searchParams = new URLSearchParams(params);
    return `${url}?${searchParams.toString()}`;
  };

  const githubFetch = async <T>(url: string): Promise<T> => {
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
    async listUserRepositories(username: string): Promise<GithubRepository[]> {
      const url = buildUrl(`/users/${username}/repos`, {
        per_page: '100',
        sort: 'updated',
      });

      return githubFetch<GithubRepository[]>(url);
    },

    async getRepository(
      owner: string,
      repo: string
    ): Promise<GithubRepository> {
      const url = buildUrl(`/repos/${owner}/${repo}`);
      return githubFetch<GithubRepository>(url);
    },

    async getLatestWorkflowRun(
      owner: string,
      repo: string,
      branch?: string
    ): Promise<GithubWorkflow | null> {
      const params: Record<string, string> = { per_page: '1' };
      if (branch) {
        params.branch = branch;
      }

      const url = buildUrl(`/repos/${owner}/${repo}/actions/runs`, params);
      const data = await githubFetch<GithubWorkflowRunsResponse>(url);

      return data.workflow_runs?.[0] ?? null;
    },
  };
};
