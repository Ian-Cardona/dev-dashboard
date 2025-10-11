import {
  AuthenticationEmailRegisterRequest,
  AuthenticationLoginRequestPublic,
  AuthenticationOAuthRegisterRequest,
  AuthenticationRefreshRequestPrivate,
  AuthenticationRefreshResponsePrivate,
  AuthenticationSuccessResponsePrivate,
  UserResponsePublic,
} from '@dev-dashboard/shared';

export interface IAuthenticationService {
  registerByEmail(
    data: AuthenticationEmailRegisterRequest
  ): Promise<AuthenticationSuccessResponsePrivate>;
  registerByOAuth(
    data: AuthenticationOAuthRegisterRequest
  ): Promise<AuthenticationSuccessResponsePrivate>;
  login(
    data: AuthenticationLoginRequestPublic
  ): Promise<AuthenticationSuccessResponsePrivate>;
  logout(refreshTokenId: string): Promise<void>;
  refreshAccessToken(
    data: AuthenticationRefreshRequestPrivate
  ): Promise<AuthenticationRefreshResponsePrivate>;
  verifyAccessToken(token: string): Promise<UserResponsePublic>;
}
