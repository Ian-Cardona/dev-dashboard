import { User, UpdateUser, GithubProvider } from '@dev-dashboard/shared';

export interface IUserRepository {
  createByEmail(user: User): Promise<User>;
  createByOAuth(user: User, accessToken: string): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByProvider(
    provider: string,
    providerUserId: string
  ): Promise<User | null>;
  findProviderByUserId(
    userId: string,
    provider: string
  ): Promise<GithubProvider | null>;
  linkProvider(user: User, providerAccessToken: string): Promise<User>;
  unlinkProvider(userId: string, provider: string): Promise<void>;
  updateProvider(updates: GithubProvider): Promise<void>;
  update(id: string, updates: UpdateUser): Promise<User>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string, timestamp: string): Promise<User>;
  updatePassword(id: string, passwordHash: string): Promise<User>;
  deactivate(id: string): Promise<User>;
}
