import {
  AuthenticationEmailRegisterRequest,
  AuthenticationOAuthRegisterRequest,
  CookieUser,
  GithubToken,
} from '@dev-dashboard/shared';

declare global {
  namespace Express {
    interface Request {
      user?: CookieUser;
      registerInit?: { jti: string };
      onboardingData:
        | AuthenticationEmailRegisterRequest
        | AuthenticationOAuthRegisterRequest;
      githubUser?: GithubToken;
    }
  }
}
