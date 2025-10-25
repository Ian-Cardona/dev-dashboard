import {
  githubAuthorizeUriSchema,
  githubCallbackRequestSchema,
  githubRepositorySchema,
  githubTokenSchema,
  githubUserSchema,
  githubWorkflowSchema,
} from '../schemas/github.schema';
import z from 'zod';

export type GithubAuthorizeUri = z.infer<typeof githubAuthorizeUriSchema>;
export type GithubCallbackRequest = z.infer<typeof githubCallbackRequestSchema>;
export type GithubToken = z.infer<typeof githubTokenSchema>;
export type GithubUser = z.infer<typeof githubUserSchema>;

export type GithubRepository = z.infer<typeof githubRepositorySchema>;
export type GithubWorkflow = z.infer<typeof githubWorkflowSchema>;
