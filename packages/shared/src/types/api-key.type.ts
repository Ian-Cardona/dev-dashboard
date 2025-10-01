import type {
  apiKeyPublicSchema,
  apiKeySchema,
  createApiKeySchema,
} from '../schemas/api-key.schema';
import z from 'zod';

export type ApiKey = z.infer<typeof apiKeySchema>;
export type ApiKeyPublic = z.infer<typeof apiKeyPublicSchema>;
export type CreateApiKey = z.infer<typeof createApiKeySchema>;
