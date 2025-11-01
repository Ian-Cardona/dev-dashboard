import {
  RegisterInitEmailRequest,
  OAuthRequest,
  RegistrationInitToken,
  RegistrationSession,
} from '@dev-dashboard/shared';

export interface IRegisterInitService {
  getEmailSession(emailSessionId: string): Promise<string | null>;
  getOauthSession(oauthSessionId: string): Promise<string | null>;
  email(data: RegisterInitEmailRequest): Promise<RegistrationSession>;
  github(data: OAuthRequest): Promise<RegistrationInitToken>;
}
