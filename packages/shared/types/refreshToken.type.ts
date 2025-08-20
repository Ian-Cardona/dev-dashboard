import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshToken.schema';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
