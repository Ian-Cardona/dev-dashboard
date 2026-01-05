import type {
  apiKeyPublicSchema,
  apiKeySchema,
  createApiKeySchema,
  safeApiKeySchema,
} from '../schemas/api-key.schema';
import z from 'zod';

export type ApiKey = z.infer<typeof apiKeySchema>;
export type ApiKeyPublic = z.infer<typeof apiKeyPublicSchema>;
export type SafeApiKey = z.infer<typeof safeApiKeySchema>;
export type CreateApiKey = z.infer<typeof createApiKeySchema>;
