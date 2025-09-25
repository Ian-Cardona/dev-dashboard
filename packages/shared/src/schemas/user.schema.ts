import { VALIDATION_CONSTANTS } from '../constants/validations';
import z from 'zod';

// Password Validation
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

// User Validation
export const userSchema = z.object({
  id: z.uuid({ message: 'Invalid UUID' }),
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
  createdAt: z.iso.datetime({ message: 'Invalid ISO datetime' }),
  updatedAt: z.iso.datetime({ message: 'Invalid ISO datetime' }),
  lastLoginAt: z.iso
    .datetime({ message: 'Invalid ISO datetime' })
    .nullish()
    .default(null)
    .optional(),
  passwordUpdatedAt: z.iso
    .datetime({ message: 'Invalid ISO datetime' })
    .nullish()
    .default(null)
    .optional(),
  isActive: z.boolean({ message: 'Invalid boolean' }),
  role: z.enum(['user', 'admin']).default('user'),
});

export const userUpdateSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  isActive: true,
  role: true,
});

export const userResponsePublicSchema = userSchema.omit({
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  passwordUpdatedAt: true,
  role: true,
});

export const uuidSchema = z.uuidv4({ message: 'Invalid UUID' });
export const emailSchema = z.email({ message: 'Invalid email' });
export const isoDateTimeSchema = z.iso.datetime({
  message: 'Invalid ISO datetime',
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string({ message: 'Current password is required' }),
    newPassword: passwordSchema,
    confirmPassword: z.string({ message: 'Password confirmation is required' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation don't match",
    path: ['confirmPassword'], // Error will be attached to confirmPassword field
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

export const userPartialUpdateSchema = userUpdateSchema.partial();
