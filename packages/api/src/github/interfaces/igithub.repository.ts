import { GithubAuthCallbackSchema } from '@dev-dashboard/shared';

export interface IGithubRepository {
  exchangeCodeForTokenRepository(
    code: string
  ): Promise<GithubAuthCallbackSchema>;
}
