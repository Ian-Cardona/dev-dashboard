import {
  booleanDefaultTrueSchema,
  descriptionSchema,
  isoDatetimeSchema,
  passwordHashSchema,
  uuidSchema,
} from '../utils/common';
import z from 'zod';

export const apiKeySchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  hash: passwordHashSchema,
  createdAt: isoDatetimeSchema,
  lastUsedAt: isoDatetimeSchema,
  description: descriptionSchema,
  expiresAt: isoDatetimeSchema,
  isActive: booleanDefaultTrueSchema,
});

export const apiKeyPublicSchema = z.object({
  id: z.string().min(1).max(36),
  pkey: z.string().min(1).max(255),
});

export const createApiKeySchema = z.object({
  description: descriptionSchema,
});

export const apiKeyIdSchemaFlexible = z
  .string()
  .regex(/^key_[0-9a-f]+$/, 'Invalid API key ID format')
  .min(1)
  .max(36)
  .describe('API key ID');
