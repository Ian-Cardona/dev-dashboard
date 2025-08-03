export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface RefreshToken {
  userId: string;
  tokenId: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
