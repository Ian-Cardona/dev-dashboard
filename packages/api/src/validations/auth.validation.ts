import z from 'zod';
import { userResponseValidation } from './user.validation';

export const authSuccessResponseValidation = z.object({
  accessToken: z.jwt(),
  refreshToken: z.uuidv4(),
  user: userResponseValidation,
});

export const authRegisterRequestValidation = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const authLoginRequestValidation = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const authRefreshRequestValidation = z.object({
  userId: z.uuidv4(),
  refreshToken: z.string(),
});
