import {
  githubAuthorizeUriSchema,
  githubCallbackRequestSchema,
  githubErrorResponseSchema,
  githubNotificationResponseSchema,
  githubNotificationSchema,
  githubProviderSchema,
  githubRepositorySchema,
  githubTokenSchema,
  githubUserSchema,
  githubWorkflowResponseSchema,
  githubWorkflowRunsResponseSchema,
  githubWorkflowSchema,
} from '../schemas/github.schema';
import z from 'zod';

export type GithubAuthorizeUri = z.infer<typeof githubAuthorizeUriSchema>;
export type GithubCallbackRequest = z.infer<typeof githubCallbackRequestSchema>;
export type GithubToken = z.infer<typeof githubTokenSchema>;
export type GithubUser = z.infer<typeof githubUserSchema>;

export type GithubRepository = z.infer<typeof githubRepositorySchema>;
export type GithubWorkflow = z.infer<typeof githubWorkflowSchema>;
export type GithubWorkflowResponse = z.infer<
  typeof githubWorkflowResponseSchema
>;
export type GithubWorkflowRunsResponse = z.infer<
  typeof githubWorkflowRunsResponseSchema
>;

export type GithubNotification = z.infer<typeof githubNotificationSchema>;
export type GithubNotificationResponse = z.infer<
  typeof githubNotificationResponseSchema
>;
export type GithubErrorResponse = z.infer<typeof githubErrorResponseSchema>;

// TODO: Make this Oauth Provider
export type GithubProvider = z.infer<typeof githubProviderSchema>;
