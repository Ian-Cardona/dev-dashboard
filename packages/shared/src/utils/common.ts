import z from 'zod';

export const uuidSchema = z.uuidv4({ message: 'Invalid UUID' });
export const emailSchema = z.email({ message: 'Invalid email' });
export const passwordHashSchema = z
  .string({ message: 'Invalid password hash' })
  .min(64, 'Invalid hash length')
  .max(128, 'Invalid hash length');
export const isoDatetimeSchema = z.iso.datetime({
  message: 'Invalid ISO datetime',
});
export const descriptionSchema = z
  .string()
  .min(1, { message: 'Description is required' })
  .max(255, { message: 'Description is too long' });
export const booleanDefaultTrueSchema = z.boolean().default(true);
export const booleanDefaultFalseSchema = z.boolean().default(false);

export const jwtSchema = z.jwt({ message: 'Invalid JWT token' });

export const oauthProviderEnum = z.enum(['github']);
export const urlSchema = z.url({ message: 'Invalid URL' });

export const linkedProviderSchema = z.object({
  provider: oauthProviderEnum,
  providerUserId: z.string(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});
