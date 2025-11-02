import {
  RegisterInitEmailRequest,
  OAuthRequest,
  RegistrationSession,
} from '@dev-dashboard/shared';

export interface IRegisterInitService {
  getEmailSession(emailSessionId: string): Promise<string | null>;
  getOAuthSession(sessionId: string): Promise<number | null>;
  email(data: RegisterInitEmailRequest): Promise<RegistrationSession>;
  github(data: OAuthRequest): Promise<RegistrationSession>;
}
