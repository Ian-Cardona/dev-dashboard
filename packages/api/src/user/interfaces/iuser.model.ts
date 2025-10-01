import { User, UserUpdate } from '@dev-dashboard/shared';

export interface IUserModel {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, updates: UserUpdate): Promise<User>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string, timestamp: string): Promise<User>;
  updatePassword(id: string, passwordHash: string): Promise<User>;
  deactivate(id: string): Promise<User>;
}
