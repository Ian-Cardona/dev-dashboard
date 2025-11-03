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

  const buildUrl = (path: string, params?: Record<string, string>): string => {
    const url = `${baseUrl}${path}`;
    if (!params) return url;

    const searchParams = new URLSearchParams(params);
    return `${url}?${searchParams.toString()}`;
  };

  const githubFetch = async <T>(url: string, token?: string): Promise<T> => {
    console.log(`Fetching URL: ${url}`);
    if (token) {
      console.log('Authorization token provided');
    } else {
      console.log('No authorization token provided');
    }
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
      console.error(
        `GitHub API failed (status ${response.status}):`,
        errorData
      );

      throw new Error(
        `GitHub API failed (status ${response.status}): ${
          errorData.message || errorData.error || response.statusText
        }`
      );
    }

    return response.json();
  };

  return {
    async listUserRepositories(
      accessToken?: string
    ): Promise<GithubRepository[]> {
      console.log(
        `listUserRepositories called with accessToken: ${accessToken ? 'provided' : 'not provided'}`
      );
      const url = buildUrl('/user/repos', {
        per_page: '100',
        sort: 'updated',
      });
      console.log(`Constructed URL for listUserRepositories: ${url}`);

      return githubFetch<GithubRepository[]>(url, accessToken);
    },

    async getRepository(
      owner: string,
      repo: string,
      accessToken?: string
    ): Promise<GithubRepository> {
      console.log(`getRepository called with owner: ${owner}, repo: ${repo}`);
      const url = buildUrl(`/repos/${owner}/${repo}`);
      return githubFetch<GithubRepository>(url, accessToken);
    },

    async getLatestWorkflowRun(
      accessToken: string,
      owner: string,
      repo: string
    ): Promise<GithubWorkflow | null> {
      console.log(
        `getLatestWorkflowRun called with owner: ${owner}, repo: ${repo}`
      );

      const params: Record<string, string> = { per_page: '1', page: '1' };

      const url = buildUrl(`/repos/${owner}/${repo}/actions/runs`, params);

      const data = await githubFetch<GithubWorkflowRunsResponse>(
        url,
        accessToken
      );
      console.table(data);
      if (!data.workflow_runs || data.workflow_runs.length === 0) {
        return null;
      }

      return data.workflow_runs[0];
    },
  };
};
