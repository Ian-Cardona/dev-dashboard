import { OAuthGithubCallbackResponseSchema } from '@dev-dashboard/shared';

export interface IGithubRepository {
  exchangeCodeForToken(
    code: string
  ): Promise<OAuthGithubCallbackResponseSchema>;
}
