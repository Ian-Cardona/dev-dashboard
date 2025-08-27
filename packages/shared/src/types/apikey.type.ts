import z from 'zod';
import type { apiKeySchema } from '../schemas/apikey.schema';

export type ApiKey = z.infer<typeof apiKeySchema>;
