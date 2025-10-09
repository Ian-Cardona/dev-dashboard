import {
  userSchema,
  userResponsePublicSchema,
  userUpdateSchema,
  passwordUpdateSchema,
  adminPasswordResetSchema,
  deactivateUserSchema,
  completeOnboardingSchema,
} from '../schemas/user.schema';
import z from 'zod';

export type User = z.infer<typeof userSchema>;
export type UserResponsePublic = z.infer<typeof userResponsePublicSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;
export type AdminPasswordReset = z.infer<typeof adminPasswordResetSchema>;
export type DeactivateUser = z.infer<typeof deactivateUserSchema>;
export type CompleteOnboarding = z.infer<typeof completeOnboardingSchema>;
