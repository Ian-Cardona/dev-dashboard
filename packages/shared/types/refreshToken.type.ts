import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshToken.schema';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;

// export interface RefreshToken {
//   userId: string;
//   refreshTokenId: string;
//   refreshTokenHash: string;
//   expiresAt: string;
//   createdAt: string;
//   revoked: boolean;
// }
