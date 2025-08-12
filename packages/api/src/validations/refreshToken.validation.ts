import z from 'zod';

export const refreshTokenValidation = z.object({
  userId: z.uuidv4({ message: 'Invalid UUID' }),
  refreshTokenId: z.uuidv4({ message: 'Invalid UUID' }),
  refreshTokenHash: z.string({ message: 'Invalid refresh token hash' }),
  expiresAt: z.iso.datetime({ message: 'Invalid ISO datetime' }),
  createdAt: z.iso.datetime({ message: 'Invalid ISO datetime' }),
  revoked: z.boolean({ message: 'Invalid boolean value' }),
});

export const refreshTokenCreateValidation = refreshTokenValidation
  .omit({
    refreshTokenId: true,
    createdAt: true,
    revoked: true,
    refreshTokenHash: true,
  })
  .extend({
    expiresAt: z.iso
      .datetime({ message: 'Invalid ISO datetime' })
      .refine(date => new Date(date) > new Date(), {
        message: 'expiresAt must be a future date',
      }),
    revoked: z.boolean({ message: 'Invalid boolean value' }).default(false),
  });
