import {
  booleanDefaultFalseSchema,
  isoDatetimeSchema,
  uuidSchema,
} from '../utils/common';
import z from 'zod';

export const refreshTokenSchema = z.object({
  userId: uuidSchema,
  id: uuidSchema,
  hash: z.string({ message: 'Invalid refresh token hash' }),
  expiresAt: isoDatetimeSchema,
  createdAt: isoDatetimeSchema,
  revoked: booleanDefaultFalseSchema,
  revokedAt: isoDatetimeSchema.nullish().default(null).optional(),
});

export const refreshTokenRecordAndPlainSchema = z.object({
  plain: uuidSchema,
  record: refreshTokenSchema,
});

export const createRefreshTokenSchema = refreshTokenSchema
  .omit({
    id: true,
    createdAt: true,
    revoked: true,
    hash: true,
  })
  .extend({
    expiresAt: isoDatetimeSchema.refine(date => new Date(date) > new Date(), {
      message: 'expiresAt must be a future date',
    }),
    revoked: booleanDefaultFalseSchema,
    revokedAt: isoDatetimeSchema.nullish().default(null).optional(),
  });
