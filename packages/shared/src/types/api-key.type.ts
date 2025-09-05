import z from 'zod';
import type {
  apiKeyPublicSchema,
  apiKeySchema,
} from '../schemas/api-key.schema';

export type ApiKey = z.infer<typeof apiKeySchema>;
export type ApiKeyPublic = z.infer<typeof apiKeyPublicSchema>;
