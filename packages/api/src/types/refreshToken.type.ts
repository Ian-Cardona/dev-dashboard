export interface RefreshToken {
  userId: string;
  refreshTokenId: string;
  refreshTokenHash: string;
  expiresAt: string;
  createdAt: string;
  revoked: boolean;
}
