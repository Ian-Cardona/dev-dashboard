import { IGithubRepository } from './interfaces/igithub.repository';
import { IGithubService } from './interfaces/igithub.service';
import {
  GithubUser,
  GithubCallbackRequest,
  GithubAuthorizeUri,
} from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';
import { ExternalServiceError } from 'src/utils/errors.utils';

export const GithubService = (
  repository: IGithubRepository
): IGithubService => {
  return {
    async exchangeCodeForToken(code: string): Promise<GithubCallbackRequest> {
      try {
        return await repository.exchangeCodeForToken(code);
      } catch (error) {
        let errorMessage;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        throw new ExternalServiceError(
          `GitHub token exchange failed ${errorMessage}`
        );
      }
    },

    async getUserProfile(accessToken: string): Promise<GithubUser> {
      try {
        return await repository.getUserProfile(accessToken);
      } catch (error) {
        let errorMessage;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        throw new ExternalServiceError(
          `GitHub user profile fetch failed ${errorMessage}`
        );
      }
    },

    async getAuthorizeLink(
      flow: 'register' | 'login'
    ): Promise<GithubAuthorizeUri> {
      try {
        const clientId = ENV.GITHUB_OAUTH_CLIENT_ID;
        const authorizeUri = ENV.GITHUB_OAUTH_AUTHORIZE_URI;
        const redirectUri = ENV.GITHUB_OAUTH_REDIRECT_URI;
        const scope = ENV.GITHUB_SCOPE;

        if (!clientId || !authorizeUri) {
          throw new Error('GitHub OAuth is not properly configured.');
        }

        const state = Buffer.from(JSON.stringify({ flow })).toString('base64');

        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          state,
          scope,
        });

        return {
          provider: 'github',
          authorize_uri: `${authorizeUri}?${params.toString()}`,
        };
      } catch {
        throw new Error('Failed to retrieve GitHub link');
      }
    },
  };
};
