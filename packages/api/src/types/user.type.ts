import z from 'zod';
import { userSchema } from '../schema/user.schema';

export type User = z.infer<typeof userSchema>;
export type ResponseUser = Omit<
  User,
  | 'passwordHash'
  | 'createdAt'
  | 'updatedAt'
  | 'lastLoginAt'
  | 'passwordUpdatedAt'
  | 'role'
>;

// export interface User {
//   userId: string;
//   email: string;
//   passwordHash: string;

//   firstName?: string;
//   lastName?: string;

//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;

//   lastLoginAt?: string;
//   passwordUpdatedAt?: string;
// }

// export type ResponseUser = Omit<
//   User,
//   | 'passwordHash'
//   | 'createdAt'
//   | 'updatedAt'
//   | 'lastLoginAt'
//   | 'passwordUpdatedAt'
// >;
