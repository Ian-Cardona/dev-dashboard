import { z } from 'zod';

export const oAuthGithubCodeSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
});

export const oAuthGithubCallbackResponseSchema = z.object({
  access_token: z.string().min(1, 'Authorization code is required'),
  token_type: z.string().min(1, 'Token Type is required'),
  scope: z.string().min(1, 'Scope is required'),
});
