import z from 'zod';
import { VALIDATION_CONSTANTS } from '../constants/validations';

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
  userId: z.uuid({ message: 'Invalid UUID' }),

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
    .optional(),
  createdAt: z.iso.datetime({ message: 'Invalid ISO datetime' }),
  updatedAt: z.iso.datetime({ message: 'Invalid ISO datetime' }),
  lastLoginAt: z.iso.datetime({ message: 'Invalid ISO datetime' }).optional(),
  passwordUpdatedAt: z.iso
    .datetime({ message: 'Invalid ISO datetime' })
    .optional(),
  isActive: z.boolean({ message: 'Invalid boolean' }),
  role: z.enum(['user', 'admin']).default('user'),
});

export const userCreateSchema = z.object({
  email: z.email({ message: 'Invalid email' }),
  password: passwordSchema,
  firstName: z
    .string()
    .min(
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MIN_LENGTH,
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
    )
    .max(
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MAX_LENGTH,
      VALIDATION_CONSTANTS.USER.FIRST_NAME.MESSAGE
    )
    .optional(),
  lastName: z
    .string()
    .min(
      VALIDATION_CONSTANTS.USER.LAST_NAME.MIN_LENGTH,
      VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
    )
    .max(
      VALIDATION_CONSTANTS.USER.LAST_NAME.MAX_LENGTH,
      VALIDATION_CONSTANTS.USER.LAST_NAME.MESSAGE
    )
    .optional(),
});

export const userUpdateSchema = userSchema.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  isActive: true,
  role: true,
});

export const responseUserSchema = userSchema.omit({
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  passwordUpdatedAt: true,
  role: true,
});

export const userIdSchema = z.uuidv4({ message: 'Invalid UUID' });
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
