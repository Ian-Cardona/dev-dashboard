import z from 'zod';
import type { apiKeySchema } from '../schemas/api-key.schema';

export type ApiKey = z.infer<typeof apiKeySchema>;
