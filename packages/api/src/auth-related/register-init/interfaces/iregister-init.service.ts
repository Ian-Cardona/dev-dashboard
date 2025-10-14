import {
  RegisterInitEmailRegisterRequest,
  RegisterInitOAuthRegisterRequest,
} from '@dev-dashboard/shared';

export interface IRegisterInitService {
  getEmailSession(emailSessionId: string): Promise<string | null>;
  email(
    data: RegisterInitEmailRegisterRequest
  ): Promise<{ registerInitToken: string; emailSessionId: string }>;
  oauth(
    data: RegisterInitOAuthRegisterRequest
  ): Promise<{ registerInitToken: string }>;
}
