import type { AuthorizationTokenPayload } from '../auth.type';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<AuthorizationTokenPayload, 'userId' | 'email'>;
    }
  }
}
