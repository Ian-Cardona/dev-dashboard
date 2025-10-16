import { z } from 'zod';

export const githubUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  login: z.string().min(1, 'Login is required'),
});
