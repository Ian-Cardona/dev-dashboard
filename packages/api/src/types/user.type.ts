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

export type SafeUser = Omit<User, 'passwordHash'>;
