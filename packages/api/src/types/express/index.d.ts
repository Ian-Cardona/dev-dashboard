import {
  CompleteRegisterByEmailRequest,
  CompleteRegisterByOAuthRequest,
  CookieUser,
  GithubToken,
} from '@dev-dashboard/shared';

declare global {
  namespace Express {
    interface Request {
      user?: CookieUser;
      registerInit?: { jti: string };
      onboardingData:
        | CompleteRegisterByEmailRequest
        | CompleteRegisterByOAuthRequest;
      githubUser?: GithubToken;
    }
  }
  export interface Response {
    timedOut?: boolean;
  }
}
