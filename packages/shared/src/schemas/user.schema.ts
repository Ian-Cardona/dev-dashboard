import {
  booleanDefaultFalseSchema,
  emailSchema,
  isoDatetimeSchema,
  linkedProviderSchema,
  passwordHashSchema,
  uuidSchema,
} from '../utils/common';
import {
  firstNameSchema,
  lastNameSchema,
  passwordLoginSchema,
  strongPasswordSchema,
} from '../utils/validations';
import z from 'zod';

export const userSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  passwordHash: passwordHashSchema.optional(),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  createdAt: isoDatetimeSchema,
  updatedAt: isoDatetimeSchema,
  lastLoginAt: isoDatetimeSchema.optional(),
  passwordUpdatedAt: isoDatetimeSchema.optional(),
  isActive: booleanDefaultFalseSchema,
  role: z.enum(['user', 'admin']).default('user'),
  providers: z
    .array(linkedProviderSchema)
    .refine(
      providers => {
        const names = providers.map(p => p.provider);
        return new Set(names).size === names.length;
      },
      {
        message: 'Cannot link multiple accounts from the same provider',
      }
    )
    .optional()
    .default([]),
});

export const updateUserSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
});

export const userPublicSchema = userSchema.pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  isActive: true,
});

export const userPasswordUpdateSchema = z.object({
  currentPassword: passwordLoginSchema,
  newPassword: strongPasswordSchema,
  confirmPassword: strongPasswordSchema,
});

export const adminPasswordResetSchema = z.object({
  newPassword: strongPasswordSchema,
  confirmPassword: strongPasswordSchema,
});

export const deactivateUserSchema = userSchema.pick({
  id: true,
  isActive: true,
});
