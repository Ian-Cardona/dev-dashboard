import z from 'zod';
import { responseUserValidation } from './user.validation';

export const authSuccessResponseValidation = z.object({
  accessToken: z.jwt(),
  refreshToken: z.uuidv4(),
  user: responseUserValidation,
});

export const authRegisterRequestValidation = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const authLoginRequestValidation = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const authRefreshRequestValidation = z.object({
  userId: z.uuidv4(),
  refreshToken: z.string().min(1),
});

export const authRefreshResponseValidation = z.object({
  accessToken: z.jwt(),
  refreshToken: z.uuidv4(),
});

export const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character'
  );

export const authRegisterRequestStrictValidation = z.object({
  email: z.email().toLowerCase(),
  password: passwordValidation,
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
});

export const authLogoutRequestValidation = z.object({
  userId: z.uuidv4(),
  refreshToken: z.string().min(1),
});
