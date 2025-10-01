import z from 'zod';

export const apiKeySchema = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4(),
  hash: z.string({ message: 'Invalid API key hash' }).trim(),
  createdAt: z.iso.datetime(),
  lastUsedAt: z.iso.datetime(),
  description: z.string().min(1).max(255),
  expiresAt: z.iso.datetime(),
  isActive: z.boolean().default(true),
});

export const apiKeyPublicSchema = z.object({
  id: z.string().min(1).max(36),
  pkey: z.string().min(1).max(255),
});

export const createApiKeySchema = z.object({
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(255),
});
