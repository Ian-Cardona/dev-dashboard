import { z } from 'zod';

export const jwtPayloadValidation = z.object({
  userId: z.uuidv4(),
  email: z.email(),
  iat: z.number().positive(),
  exp: z.number().positive(),
});
