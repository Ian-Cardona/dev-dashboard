import {
  RegisterGithubAuthLinkResponse,
  RegisterInitEmailRegisterRequest,
  RegisterInitOAuthRegisterRequest,
} from '@dev-dashboard/shared';

export interface IRegisterInitService {
  getEmailSession(emailSessionId: string): Promise<string | null>;
  email(
    data: RegisterInitEmailRegisterRequest
  ): Promise<{ registerInitToken: string; emailSessionId: string }>;
  getGithubAuthorizeLink(): Promise<RegisterGithubAuthLinkResponse>;
  oauth(
    data: RegisterInitOAuthRegisterRequest
  ): Promise<{ registerInitToken: string }>;
}
