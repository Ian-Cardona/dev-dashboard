import { IGithubRepository } from './interfaces/igithub.repository';
import { OAuthGithubCallbackResponseSchema } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env_variables';

export const GithubRepository = (): IGithubRepository => {
  return {
    async exchangeCodeForToken(
      code: string
    ): Promise<OAuthGithubCallbackResponseSchema> {
      const clientId = ENV.GITHUB_CLIENT_ID;
      const clientSecret = ENV.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('GitHub OAuth credentials not configured');
      }

      const response = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: ENV.GITHUB_REDIRECT_URI,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          `GitHub OAuth failed: ${data.error_description || data.error || response.statusText}`
        );
      }

      return data;
    },
  };
};
