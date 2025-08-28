import z from 'zod';

export const apiKeySchema = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4(),
  hash: z.string({ message: 'Invalid API key hash' }).trim(),
  createdAt: z.iso.datetime(),
  lastUsedAt: z.iso.datetime(),
  description: z.string().max(255).optional(),
  isActive: z.boolean().default(true),
});
