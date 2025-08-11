import z from 'zod';
import { userResponseValidation } from './user.validation';

export const authSuccessResponseValidation = z.object({
  accessToken: z.jwt(),
  refreshToken: z.uuidv4(),
  user: userResponseValidation,
});
