import {
  oAuthGithubCallbackResponseSchema,
  oAuthGithubCodeSchema,
} from '../schemas/oauth.schema';
import z from 'zod';

export type OAuthGithubCodeSchema = z.infer<typeof oAuthGithubCodeSchema>;
export type OAuthGithubCallbackResponseSchema = z.infer<
  typeof oAuthGithubCallbackResponseSchema
>;
