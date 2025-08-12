import z from 'zod';
import { VALIDATION_CONSTANTS } from '../constants/validations';

export const userValidation = z.object({
  userId: z.uuid({ message: 'Invalid UUID' }),

  email: z.email({ message: 'Invalid email address' }),
  passwordHash: z
    .string({ message: 'Invalid password hash' })
    .trim()
    .min(
      VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH,
      VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MESSAGE
    )
    .max(
      VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MAX_LENGTH,
      VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MESSAGE
    ),
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
  passwordUpdatedAt: z.iso.datetime({ message: 'Invalid ISO datetime' }),
  isActive: z.boolean({ message: 'Invalid boolean' }),
  emailVerified: z.boolean({ message: 'Invalid boolean' }),
});

export const userCreateValidation = userValidation.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  isActive: true,
  passwordUpdatedAt: true,
  emailVerified: true,
});

export const userUpdateValidation = userValidation.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  isActive: true,
  emailVerified: true,
});

export const responseUserValidation = userValidation.omit({
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  passwordUpdatedAt: true,
});
