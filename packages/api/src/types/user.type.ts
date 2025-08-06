export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export type CreateUserResponse = Omit<User, 'passwordHash'>;
