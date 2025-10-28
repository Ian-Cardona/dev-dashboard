import { isoDatetimeSchema, urlSchema } from '../utils/common';
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
  access_token: z.string().min(1).max(512),
  token_type: z.string().min(1),
  scope: z.string().optional(),
});

export const githubUserSchema = z.object({
  id: z.string().min(1).max(100),
  login: z.string().min(1).max(100),
});

export const githubRepositorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  fullName: z.string().min(1).max(300),
  owner: z.string().min(1).max(100),
  private: z.boolean(),
  htmlUrl: urlSchema,
  description: z.string().max(500).optional(),
  defaultBranch: z.string().min(1).max(100),
  openIssuesCount: z.number().int().nonnegative(),
  fork: z.boolean(),
  archived: z.boolean(),
});

export const githubWorkflowSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  status: z.enum(['queued', 'in_progress', 'completed']),
  conclusion: z
    .enum([
      'success',
      'failure',
      'neutral',
      'cancelled',
      'timed_out',
      'action_required',
    ])
    .nullable(),
  htmlUrl: urlSchema,
  createdAt: isoDatetimeSchema,
  updatedAt: isoDatetimeSchema,
  headBranch: z.string().min(1).max(100),
  headSha: z.string().length(40),
});
