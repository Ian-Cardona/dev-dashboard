import z from 'zod';
import {
  refreshTokenRecordAndPlainSchema,
  refreshTokenSchema,
} from '../schemas/refreshToken.schema';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
export type RefreshTokenRecordAndPlain = z.infer<
  typeof refreshTokenRecordAndPlainSchema
>;
