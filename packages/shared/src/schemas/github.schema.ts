import { z } from 'zod';

export const githubCodeSchema = z.object({
  code: z.string().min(1, { message: 'Code parameter cannot be empty' }),
});

export const githubAuthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
});
