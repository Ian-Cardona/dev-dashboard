import z from 'zod';

export const refreshTokenValidation = z.object({
  userId: z.uuidv4(),
  tokenId: z.uuidv4(),
  refreshToken: z.jwt(),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});
