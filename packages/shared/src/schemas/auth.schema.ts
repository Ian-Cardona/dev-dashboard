import { userResponsePublicSchema } from './user.schema';
import z from 'zod';

// Helper Validation
export const passwordStrengthValidation = (email?: string, username?: string) =>
  z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    )
    .refine(
      pwd =>
        !(
          email && pwd.toLowerCase().includes(email.split('@')[0].toLowerCase())
        ),
      {
        message: 'Password cannot contain your email',
      }
    )
    .refine(
      pwd => !(username && pwd.toLowerCase().includes(username.toLowerCase())),
      {
        message: 'Password cannot contain your username',
      }
    )
    .refine(pwd => !/(.)\1{3,}/.test(pwd), {
      message: 'Password cannot contain 4 or more repeating characters',
    })
    .refine(
      pwd =>
        !/(0123|1234|2345|3456|4567|5678|6789|7890|abcd|bcde|cdef|qwerty)/i.test(
          pwd
        ),
      {
        message: 'Password is too simple',
      }
    );

export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(128, 'Password must not exceed 128 characters')
  .refine(pwd => /^[\x20-\x7E]+$/.test(pwd), {
    message: 'Password contains invalid characters',
  });

// Register Validation
export const authenticationRegisterRequestPublicSchema = z.object({
  email: z.email(),
  password: passwordStrengthValidation(),
  firstName: z.string().nullish().default(null),
  lastName: z.string().nullish().default(null),
});

// Login Validation
export const authenticationLoginRequestPublicSchema = z.object({
  email: z.email(),
  password: loginPasswordSchema,
});

// Success Response Validation
export const authenticationSuccessResponsePrivateSchema = z.object({
  accessToken: z.jwt(),
  refreshTokenPlain: z.string(),
  refreshTokenId: z.uuidv4(),
  user: userResponsePublicSchema,
});

// Refresh Validation
export const authenticationRefreshRequestPrivateSchema = z.object({
  refreshTokenId: z.uuidv4(),
  refreshTokenPlain: z.string(),
});

// Refresh Response Validation
export const authenticationRefreshResponsePrivateSchema = z.object({
  accessToken: z.jwt(),
  refreshTokenPlain: z.string(),
  refreshTokenId: z.uuidv4(),
});

// Public Response Validation
export const authenticationResponsePublicSchema = z.object({
  accessToken: z.jwt(),
  user: userResponsePublicSchema,
});

export const authorizationJwtSchema = z.object({
  accessToken: z.jwt(),
});
