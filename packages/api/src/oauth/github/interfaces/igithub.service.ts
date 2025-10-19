import {
  GithubAuthorizeUri,
  GithubCallbackRequest,
  GithubUser,
} from '@dev-dashboard/shared';

export interface IGithubService {
  exchangeCodeForToken(code: string): Promise<GithubCallbackRequest>;
  getUserProfile(accessToken: string): Promise<GithubUser>;
  getAuthorizeLink(flow: 'register' | 'login'): Promise<GithubAuthorizeUri>;
}
