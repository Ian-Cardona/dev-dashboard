import {
  adminPasswordResetSchema,
  deactivateUserSchema,
  updateUserSchema,
  userPasswordUpdateSchema,
  userPublicSchema,
  userSchema,
} from '../schemas/user.schema';
import z from 'zod';

export type User = z.infer<typeof userSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserPublic = z.infer<typeof userPublicSchema>;
export type UserPasswordUpdate = z.infer<typeof userPasswordUpdateSchema>;
export type AdminPasswordReset = z.infer<typeof adminPasswordResetSchema>;
export type DeactivateUser = z.infer<typeof deactivateUserSchema>;
