import { IGithubRepository } from './interfaces/igithub.repository';
import { GithubAuthCallbackSchema } from '@dev-dashboard/shared';
import { ENV } from 'src/config/env_variables';

export const GithubRepository = (): IGithubRepository => {
  return {
    async exchangeCodeForTokenRepository(
      code: string
    ): Promise<GithubAuthCallbackSchema> {
      const clientId = ENV.GITHUB_CLIENT_ID;
      const clientSecret = ENV.GITHUB_CLIENT_SECRET;

      if (!clientId) {
        throw new Error(
          'GITHUB_CLIENT_ID is not defined in environment variables'
        );
      }
      if (!clientSecret) {
        throw new Error(
          'GITHUB_CLIENT_SECRET is not defined in environment variables'
        );
      }

      const response = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to exchange code for token: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    },
  };
};
