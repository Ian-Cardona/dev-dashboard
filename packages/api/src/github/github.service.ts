import { IGithubRepository } from './interfaces/igithub.repository';
import { IGithubService } from './interfaces/igithub.service';
import {
  githubAuthCallbackSchema,
  GithubAuthCallbackSchema,
} from '@dev-dashboard/shared';

export const GithubService = (
  repository: IGithubRepository
): IGithubService => {
  return {
    async exchangeCodeForToken(
      code: string
    ): Promise<GithubAuthCallbackSchema> {
      if (!code || typeof code !== 'string') {
        throw new Error('Invalid GitHub authorization code');
      }

      try {
        const data = await repository.exchangeCodeForTokenRepository(code);
        const validatedData = githubAuthCallbackSchema.parse(data);
        return validatedData;
      } catch (error) {
        console.error('[GithubService] Token exchange failed:', error);
        throw new Error('Failed to exchange GitHub code for token');
      }
    },
  };
};
