import {
  CompleteRegisterByEmailRequest,
  CompleteRegisterByOAuthRequest,
  LoginPrivate,
  LoginRequestPublic,
  OAuthRequest,
  RefreshPrivate,
  RefreshRequestPrivate,
  UserPublic,
} from '@dev-dashboard/shared';

export interface IAuthenticationService {
  completeRegisterByEmail(
    data: CompleteRegisterByEmailRequest
  ): Promise<LoginPrivate>;
  completeRegisterByOAuth(
    data: CompleteRegisterByOAuthRequest
  ): Promise<LoginPrivate>;
  loginByEmail(data: LoginRequestPublic): Promise<LoginPrivate>;
  loginByOAuth(data: OAuthRequest): Promise<LoginPrivate>;
  logout(refreshTokenId: string): Promise<void>;
  refreshAccessToken(data: RefreshRequestPrivate): Promise<RefreshPrivate>;
  verifyAccessToken(token: string): Promise<UserPublic>;
}
