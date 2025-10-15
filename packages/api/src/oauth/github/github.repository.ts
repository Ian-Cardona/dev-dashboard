import { IGithubRepository } from './interfaces/igithub.repository';
import { OAuthGithubCallbackResponseSchema } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env_variables';

export const GithubRepository = (): IGithubRepository => {
  return {
    async exchangeCodeForToken(
      code: string
    ): Promise<OAuthGithubCallbackResponseSchema> {
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

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          `GitHub OAuth failed (status ${response.status}): ${
            data.error_description || data.error || response.statusText
          }`
        );
      }

      return data;
    },
  };
};
