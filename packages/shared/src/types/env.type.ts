import { envSchema } from '../schemas/env.schema';
import z from 'zod';

export type Environment = z.infer<typeof envSchema>;
