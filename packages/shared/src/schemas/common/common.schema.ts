import z from 'zod';

export const uuidSchema = z.uuidv4({ message: 'Invalid UUID' });
export const emailSchema = z.email({ message: 'Invalid email' });

export const oAuthProviderEnum = z.enum(['github']);

export const linkedProviderSchema = z.object({
  provider: oAuthProviderEnum,
  providerUserId: z.string(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});
