import type {
  apiKeyPublicSchema,
  apiKeySchema,
} from '../schemas/api-key.schema';
import z from 'zod';

export type ApiKey = z.infer<typeof apiKeySchema>;
export type ApiKeyPublic = z.infer<typeof apiKeyPublicSchema>;
