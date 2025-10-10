import { OAuthGithubCallbackResponseSchema } from '@dev-dashboard/shared';

export interface IGithubService {
  exchangeCodeForToken(
    code: string
  ): Promise<OAuthGithubCallbackResponseSchema>;
}
