import { urlSchema } from '../utils/common';
import { z } from 'zod';

export const githubAuthorizeUriSchema = z.object({
  provider: z.literal('github'),
  authorize_uri: urlSchema,
});

export const githubCallbackRequestSchema = z.object({
  code: z.string().min(1).max(100),
  state: z.string().optional(),
});

export const githubTokenSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  scope: z.string().optional(),
});

export const githubUserSchema = z.object({
  id: z.string().min(1).max(100),
  login: z.string().min(1).max(100),
});
