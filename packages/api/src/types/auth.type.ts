import { ResponseUser } from './user.type';

export interface AuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: ResponseUser;
}

export type AuthRefreshResponse = Omit<AuthSuccessResponse, 'user'>;
