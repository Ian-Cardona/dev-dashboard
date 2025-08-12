import { ResponseUser } from './user.type';

export type AuthRegisterRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type AuthRefreshRequest = {
  userId: string;
  refreshToken: string;
};

export interface AuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: ResponseUser;
}

export type AuthRefreshResponse = Omit<AuthSuccessResponse, 'user'>;
