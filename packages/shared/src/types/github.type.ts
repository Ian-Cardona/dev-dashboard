import {
  githubAuthCallbackSchema,
  githubCodeSchema,
} from '../schemas/github.schema';
import z from 'zod';

export type GithubCodeSchema = z.infer<typeof githubCodeSchema>;
export type GithubAuthCallbackSchema = z.infer<typeof githubAuthCallbackSchema>;
