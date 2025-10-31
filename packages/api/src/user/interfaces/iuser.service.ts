import {
  CompleteRegisterByEmailRequest,
  CompleteRegisterByOAuthRequest,
  GithubProvider,
  User,
  UserPublic,
} from '@dev-dashboard/shared';

export interface IUserService {
  createByEmail(user: CompleteRegisterByEmailRequest): Promise<UserPublic>;
  createByOAuth(user: CompleteRegisterByOAuthRequest): Promise<UserPublic>;
  findById(userId: string): Promise<UserPublic>;
  findByEmailPrivate(email: string): Promise<User>;
  findByEmailPublic(email: string): Promise<UserPublic>;
  findByProvider(provider: string, providerUserId: string): Promise<UserPublic>;
  findProviderByUserId(
    userId: string,
    provider: string
  ): Promise<GithubProvider | null>;
  updateProvider(updates: GithubProvider): Promise<void>;
  emailExists(email: string): Promise<boolean>;
  update(
    userId: string,
    updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
  ): Promise<UserPublic>;
  delete(userId: string): Promise<void>;
  updateLastLogin(userId: string, timestamp: string): Promise<UserPublic>;
  updatePassword(userId: string, passwordHash: string): Promise<UserPublic>;
  deactivate(userId: string): Promise<UserPublic>;
}
