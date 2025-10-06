import { GithubAuthCallbackSchema } from '@dev-dashboard/shared';

export interface IGithubService {
  exchangeCodeForToken(code: string): Promise<GithubAuthCallbackSchema>;
}
