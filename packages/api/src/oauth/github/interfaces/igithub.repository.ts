import { GithubCallbackRequest, GithubUser } from '@dev-dashboard/shared';

export interface IGithubRepository {
  exchangeCodeForToken(code: string): Promise<GithubCallbackRequest>;
  getUserProfile(accessToken: string): Promise<GithubUser>;
}
