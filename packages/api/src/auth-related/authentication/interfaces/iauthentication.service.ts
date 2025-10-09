import {
  AuthenticationEmailRegisterRequestSchema,
  AuthenticationLoginRequestPublicSchema,
  AuthenticationOAuthRegisterRequestSchema,
  AuthenticationRefreshRequestPrivateSchema,
  AuthenticationRefreshResponsePrivateSchema,
  AuthenticationSuccessResponsePrivateSchema,
  UserResponsePublic,
} from '@dev-dashboard/shared';

export interface IAuthenticationService {
  registerByEmail(
    data: AuthenticationEmailRegisterRequestSchema
  ): Promise<AuthenticationSuccessResponsePrivateSchema>;
  registerByOAuth(
    data: AuthenticationOAuthRegisterRequestSchema
  ): Promise<AuthenticationSuccessResponsePrivateSchema>;
  login(
    data: AuthenticationLoginRequestPublicSchema
  ): Promise<AuthenticationSuccessResponsePrivateSchema>;
  logout(refreshTokenId: string): Promise<void>;
  refreshAccessToken(
    data: AuthenticationRefreshRequestPrivateSchema
  ): Promise<AuthenticationRefreshResponsePrivateSchema>;
  verifyAccessToken(token: string): Promise<UserResponsePublic>;
}
