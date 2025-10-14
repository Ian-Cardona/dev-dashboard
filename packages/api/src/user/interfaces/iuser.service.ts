import {
  AuthenticationEmailRegisterRequest,
  AuthenticationOAuthRegisterRequest,
  User,
  UserResponsePublic,
} from '@dev-dashboard/shared';

export interface IUserService {
  createByEmail(
    user: AuthenticationEmailRegisterRequest
  ): Promise<UserResponsePublic>;
  createByOAuth(
    user: AuthenticationOAuthRegisterRequest
  ): Promise<UserResponsePublic>;
  findById(userId: string): Promise<UserResponsePublic>;
  findByEmailPrivate(email: string): Promise<User>;
  findByEmailPublic(email: string): Promise<UserResponsePublic>;
  emailExists(email: string): Promise<boolean>;
  providerExists(provider: string, providerUserId: string): Promise<boolean>;
  update(
    userId: string,
    updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
  ): Promise<UserResponsePublic>;
  delete(userId: string): Promise<void>;
  updateLastLogin(
    userId: string,
    timestamp: string
  ): Promise<UserResponsePublic>;
  updatePassword(
    userId: string,
    passwordHash: string
  ): Promise<UserResponsePublic>;
  deactivate(userId: string): Promise<UserResponsePublic>;
}
