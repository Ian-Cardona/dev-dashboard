import {
  authorizationJwtSchema,
  completeRegisterByEmailRequestSchema,
  completeRegisterByOAuthRequestSchema,
  loginPrivateSchema,
  loginPublicSchema,
  loginRequestPublicSchema,
  refreshPrivateSchema,
  refreshRequestPrivateSchema,
  registerInitEmailRequestSchema,
  registerInitTokenSchema,
  registrationInfoRequestSchema,
  registrationJtiSchema,
  registrationSessionSchema,
  oauthRequestSchema,
} from '../schemas/auth.schema';
import { JwtPayload } from 'jsonwebtoken';
import z from 'zod';

export type RegisterInitEmailRequest = z.infer<
  typeof registerInitEmailRequestSchema
>;
export type OAuthRequest = z.infer<typeof oauthRequestSchema>;
export type RegistrationJti = z.infer<typeof registrationJtiSchema>;
export type RegistrationInitToken = z.infer<typeof registerInitTokenSchema>;
export type RegistrationSession = z.infer<typeof registrationSessionSchema>;
export type RegistrationInfoRequest = z.infer<
  typeof registrationInfoRequestSchema
>;

export type CompleteRegisterByEmailRequest = z.infer<
  typeof completeRegisterByEmailRequestSchema
>;
export type CompleteRegisterByOAuthRequest = z.infer<
  typeof completeRegisterByOAuthRequestSchema
>;

export type LoginRequestPublic = z.infer<typeof loginRequestPublicSchema>;
export type LoginPrivate = z.infer<typeof loginPrivateSchema>;
export type LoginPublic = z.infer<typeof loginPublicSchema>;

export type RefreshPrivate = z.infer<typeof refreshPrivateSchema>;
export type RefreshRequestPrivate = z.infer<typeof refreshRequestPrivateSchema>;

export type AuthorizationJwt = z.infer<typeof authorizationJwtSchema>;
export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  isActive: boolean;
  type: 'access';
}
export interface RegisterInitTokenPayload extends JwtPayload {
  jti: string;
  type: 'register-init';
}
