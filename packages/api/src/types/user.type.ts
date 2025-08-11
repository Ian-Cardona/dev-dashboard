export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  passwordUpdatedAt?: string;
}

export type ResponseUser = Omit<
  User,
  | 'passwordHash'
  | 'createdAt'
  | 'updatedAt'
  | 'lastLoginAt'
  | 'passwordUpdatedAt'
>;
