import z from 'zod';
import { VALIDATION_CONSTANTS } from '../constants/validations';

export const userValidation = z.object({
  userId: z.uuidv4(),
  email: z.email(),
  passwordHash: z
    .string()
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
    .string()
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
    .string()
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
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  lastLoginAt: z.iso.datetime().optional(),
  isActive: z.boolean(),
});

export const userCreateValidation = userValidation.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  isActive: true,
});

export const userUpdateValidation = userValidation
  .omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
    isActive: true,
  })
  .partial();

export const userResponseValidation = userValidation.omit({
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  passwordUpdatedAt: true,
});
