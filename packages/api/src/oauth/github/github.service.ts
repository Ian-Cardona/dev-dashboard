import { IGithubRepository } from './interfaces/igithub.repository';
import { IGithubService } from './interfaces/igithub.service';
import { OAuthGithubCallbackResponseSchema } from '@dev-dashboard/shared';
import { ExternalServiceError } from 'src/utils/errors.utils';

export const GithubService = (
  repository: IGithubRepository
): IGithubService => {
  return {
    async exchangeCodeForToken(
      code: string
    ): Promise<OAuthGithubCallbackResponseSchema> {
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
  };
};
