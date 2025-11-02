import { IGithubRepository } from './interfaces/igithub.repository';
import { GithubCallbackRequest } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';

export const GithubRepository = (): IGithubRepository => {
  return {
    async exchangeCodeForToken(code: string): Promise<GithubCallbackRequest> {
      const clientId = ENV.GITHUB_OAUTH_CLIENT_ID;
      const clientSecret = ENV.GITHUB_OAUTH_CLIENT_SECRET;
      const accessTokenUri = ENV.GITHUB_OAUTH_ACCESS_TOKEN_URI;

      if (!clientId || !clientSecret || !accessTokenUri) {
        throw new Error('GitHub OAuth credentials not configured');
      }

      const response = await fetch(accessTokenUri, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: ENV.GITHUB_OAUTH_REDIRECT_URI,
        }),
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

    async getUserProfile(accessToken: string) {
      const url = 'https://api.github.com/user';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': ENV.APP_NAME || 'dev-dashboard',
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          `Failed to fetch GitHub user profile (status ${response.status}): ${message}`
        );
      }

      const data = await response.json();
      return data;
    },
  };
};
