import {
  AuthenticationEmailRegisterRequest,
  AuthenticationLoginRequestPublic,
  AuthenticationOAuthRegisterRequest,
  AuthenticationRefreshRequestPrivate,
  AuthenticationRefreshResponsePrivate,
  AuthenticationSuccessResponsePrivate,
  RegisterInitOAuthRegisterRequest,
  UserResponsePublic,
} from '@dev-dashboard/shared';

export interface IAuthenticationService {
  registerByEmail(
    data: AuthenticationEmailRegisterRequest
  ): Promise<AuthenticationSuccessResponsePrivate>;
  registerByOAuth(
    data: AuthenticationOAuthRegisterRequest
  ): Promise<AuthenticationSuccessResponsePrivate>;
  loginByEmail(
    data: AuthenticationLoginRequestPublic
  ): Promise<AuthenticationSuccessResponsePrivate>;
  loginByOAuth(
    // HACK: Gotta refactor the schema to make this cleaner
    data: RegisterInitOAuthRegisterRequest
  ): Promise<AuthenticationSuccessResponsePrivate>;
  logout(refreshTokenId: string): Promise<void>;
  refreshAccessToken(
    data: AuthenticationRefreshRequestPrivate
  ): Promise<AuthenticationRefreshResponsePrivate>;
  verifyAccessToken(token: string): Promise<UserResponsePublic>;
}
