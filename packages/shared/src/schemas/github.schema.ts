import {
  isoDatetimeSchema,
  oauthProviderEnum,
  urlSchema,
} from '../utils/common';
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
  accessTokenEncrypted: z.string().min(1).max(512).optional(),
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
  access_token: z.string().min(1).max(512),
  owner: z.string().min(1).max(255),
  repo: z.string().min(1).max(512),
});

export const githubWorkflowResponseSchema = z.object({
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

export const githubWorkflowRunsResponseSchema = z.object({
  workflow_runs: z.array(githubWorkflowResponseSchema).optional(),
});

export const githubNotificationSchema = z.object({
  access_token: z.string().min(1).max(512),
  all: z.boolean().default(false),
  participating: z.boolean().default(false),
  per_page: z.number().min(1).max(100).default(100),
});

export const githubNotificationResponseSchema = z.object({
  id: z.string().min(1).max(100),
  unread: z.boolean(),
  reason: z.string().min(1).max(100),
  repository: z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(200),
    fullName: z.string().min(1).max(300),
    htmlUrl: urlSchema,
  }),
  subject: z.object({
    title: z.string().min(1).max(300),
    type: z.string().min(1).max(100),
    url: urlSchema,
    latestCommentUrl: urlSchema.optional(),
  }),
  updatedAt: isoDatetimeSchema,
});

export const githubProviderSchema = z.object({
  provider: oauthProviderEnum,
  providerUserId: z.string().min(1).max(100),
  providerAccessTokenEncrypted: z.string().min(1).max(512),
  providerUpdatedAt: isoDatetimeSchema,
});

export const githubErrorResponseSchema = z.object({
  message: z.string().min(1).optional(),
  error: z.string().min(1).optional(),
});
