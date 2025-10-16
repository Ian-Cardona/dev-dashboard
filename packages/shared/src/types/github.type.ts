import { githubUserSchema } from '../schemas/github.schema';
import z from 'zod';

export type GithubUserSchema = z.infer<typeof githubUserSchema>;
