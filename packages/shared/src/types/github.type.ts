import {
  githubAuthorizeUriSchema,
  githubCallbackRequestSchema,
  githubTokenSchema,
  githubUserSchema,
} from '../schemas/github.schema';
import z from 'zod';

export type GithubAuthorizeUri = z.infer<typeof githubAuthorizeUriSchema>;
export type GithubCallbackRequest = z.infer<typeof githubCallbackRequestSchema>;
export type GithubToken = z.infer<typeof githubTokenSchema>;
export type GithubUser = z.infer<typeof githubUserSchema>;
