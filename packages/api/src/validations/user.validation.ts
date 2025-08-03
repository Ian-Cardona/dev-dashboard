import z from 'zod';
import { USER_VALIDATION } from '../constants/validations';

export const userValidation = z.object({
  userId: z.uuidv4(),
  email: z.email(),
  passwordHash: z
    .string()
    .min(
      USER_VALIDATION.PASSWORD_HASH.MIN_LENGTH,
      USER_VALIDATION.PASSWORD_HASH.MESSAGE
    )
    .max(
      USER_VALIDATION.PASSWORD_HASH.MAX_LENGTH,
      USER_VALIDATION.PASSWORD_HASH.MESSAGE
    ),
  firstName: z
    .string()
    .min(
      USER_VALIDATION.FIRST_NAME.MIN_LENGTH,
      USER_VALIDATION.FIRST_NAME.MESSAGE
    )
    .max(
      USER_VALIDATION.FIRST_NAME.MAX_LENGTH,
      USER_VALIDATION.FIRST_NAME.MESSAGE
    )
    .optional(),
  lastName: z
    .string()
    .min(
      USER_VALIDATION.LAST_NAME.MIN_LENGTH,
      USER_VALIDATION.LAST_NAME.MESSAGE
    )
    .max(
      USER_VALIDATION.LAST_NAME.MAX_LENGTH,
      USER_VALIDATION.LAST_NAME.MESSAGE
    )
    .optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  lastLoginAt: z.iso.datetime().optional(),
  isActive: z.boolean(),
});

export const refreshTokenValidation = z.object({
  userId: z.uuidv4(),
  tokenId: z.uuidv4(),
  refreshToken: z.jwt(),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export const jwtPayloadValidation = z.object({
  userId: z.uuidv4(),
  email: z.email(),
  iat: z.number().positive(),
  exp: z.number().positive(),
});
