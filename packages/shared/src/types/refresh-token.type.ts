import {
  createRefreshTokenSchema,
  refreshTokenRecordAndPlainSchema,
  refreshTokenSchema,
} from '../schemas/refresh-token.schema';
import z from 'zod';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
export type RefreshTokenRecordAndPlain = z.infer<
  typeof refreshTokenRecordAndPlainSchema
>;
export type CreateRefreshToken = z.infer<typeof createRefreshTokenSchema>;
