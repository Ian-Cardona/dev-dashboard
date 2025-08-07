import z from 'zod';

export const refreshTokenValidation = z.object({
  userId: z.uuidv4(),
  tokenId: z.uuidv4(),
  refreshToken: z.jwt(),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export const refreshTokenCreateValidation = refreshTokenValidation
  .omit({
    tokenId: true,
    createdAt: true,
  })
  .extend({
    expiresAt: z.iso.datetime().refine(date => new Date(date) > new Date(), {
      message: 'expiresAt must be a future date',
    }),
  });
