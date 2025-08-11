import z from 'zod';

export const refreshTokenValidation = z.object({
  userId: z.uuidv4(),
  refreshTokenId: z.uuidv4(),
  refreshTokenHash: z.string(),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  revoked: z.boolean(),
});

export const refreshTokenCreateValidation = refreshTokenValidation
  .omit({
    refreshTokenId: true,
    createdAt: true,
    revoked: true,
    refreshTokenHash: true,
  })
  .extend({
    expiresAt: z.iso.datetime().refine(date => new Date(date) > new Date(), {
      message: 'expiresAt must be a future date',
    }),
    revoked: z.boolean().default(false),
  });
