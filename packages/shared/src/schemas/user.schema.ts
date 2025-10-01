import { VALIDATION_CONSTANTS } from '../constants/validations';
import z from 'zod';

// TODO: Fix the naming scheme here as I created this when I was starting out
// For Password Validation
export const passwordSchema = z
  .string({ message: 'Password is required' })
  .min(
    VALIDATION_CONSTANTS.USER.PASSWORD.MIN_LENGTH,
    VALIDATION_CONSTANTS.USER.PASSWORD.MESSAGE
  )
  .max(
    VALIDATION_CONSTANTS.USER.PASSWORD.MAX_LENGTH,
    VALIDATION_CONSTANTS.USER.PASSWORD.MESSAGE
  )
  .regex(
    VALIDATION_CONSTANTS.USER.PASSWORD.PATTERN,
    VALIDATION_CONSTANTS.USER.PASSWORD.MESSAGE
  );

export const userSchema = z.object({
  id: z.uuidv4({ message: 'Invalid UUID' }),
  email: z.email({ message: 'Invalid email address' }),
  passwordHash: z.string({ message: 'Invalid password hash' }).trim(),
  firstName: z
    .string({ message: 'Invalid first name' })
    .trim()
    .min(
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MIN_LENGTH,
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
    )
    .max(
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MAX_LENGTH,
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
    )
    .nullish()
    .default(null)
    .optional(),
  lastName: z
    .string({ message: 'Invalid last name' })
    .trim()
    .min(
      VALIDATION_CONSTANTS.USER.LAST_NAME.MIN_LENGTH,
      VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
    )
    .max(
      VALIDATION_CONSTANTS.USER.LAST_NAME.MAX_LENGTH,
      VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
    )
    .nullish()
    .default(null)
    .optional(),
  createdAt: z.iso.datetime({ message: 'Invalid datetime format' }),
  updatedAt: z.iso.datetime({ message: 'Invalid datetime format' }),
  lastLoginAt: z.iso
    .datetime({ message: 'Invalid datetime format' })
    .nullish()
    .default(null)
    .optional(),
  passwordUpdatedAt: z.iso
    .datetime({ message: 'Invalid datetime format' })
    .nullish()
    .default(null)
    .optional(),
  isActive: z.boolean({ message: 'Invalid format' }),
  role: z.enum(['user', 'admin']).default('user'),
});

export const userUpdateSchema = userSchema.pick({
  firstName: true,
  lastName: true,
});

export const userResponsePublicSchema = userSchema.pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  isActive: true,
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string({ message: 'Current password is required' }),
    newPassword: passwordSchema,
    confirmPassword: z.string({ message: 'Password confirmation is required' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation don't match",
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const adminPasswordResetSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string({ message: 'Password confirmation is required' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation don't match",
    path: ['confirmPassword'],
  });

export const deactivateUserSchema = userSchema.pick({
  id: true,
  isActive: true,
});
