import { GithubAuthResponseSchema } from '@dev-dashboard/shared';

export interface IGithubService {
  exchangeCodeForToken(code: string): Promise<GithubAuthResponseSchema>;
}
