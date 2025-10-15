import {
  authenticationEmailRegisterRequestSchema,
  authenticationLoginRequestPublicSchema,
  authenticationOAuthRegisterRequestSchema,
  authenticationRefreshRequestPrivateSchema,
  authenticationRefreshResponsePrivateSchema,
  authenticationResponsePublicSchema,
  authenticationSuccessResponsePrivateSchema,
  authorizationJwtSchema,
  onboardingInfoRequestSchema,
  registerInitEmailRegisterRequestSchema,
  registerInitOAuthRegisterRequestSchema,
  registerInitSessionDataSchema,
  registerGithubAuthLinkResponseSchema,
} from '../schemas/auth.schema';
import { JwtPayload } from 'jsonwebtoken';
import z from 'zod';

export type RegisterInitEmailRegisterRequest = z.infer<
  typeof registerInitEmailRegisterRequestSchema
>;
export type RegisterInitOAuthRegisterRequest = z.infer<
  typeof registerInitOAuthRegisterRequestSchema
>;
export type RegisterInitSessionData = z.infer<
  typeof registerInitSessionDataSchema
>;
export type RegisterGithubAuthLinkResponse = z.infer<
  typeof registerGithubAuthLinkResponseSchema
>;

export type OnboardingInfoRequest = z.infer<typeof onboardingInfoRequestSchema>;

export type AuthenticationEmailRegisterRequest = z.infer<
  typeof authenticationEmailRegisterRequestSchema
>;
export type AuthenticationOAuthRegisterRequest = z.infer<
  typeof authenticationOAuthRegisterRequestSchema
>;

export type AuthenticationLoginRequestPublic = z.infer<
  typeof authenticationLoginRequestPublicSchema
>;
export type AuthenticationSuccessResponsePrivate = z.infer<
  typeof authenticationSuccessResponsePrivateSchema
>;

export type AuthenticationRefreshRequestPrivate = z.infer<
  typeof authenticationRefreshRequestPrivateSchema
>;
export type AuthenticationRefreshResponsePrivate = z.infer<
  typeof authenticationRefreshResponsePrivateSchema
>;
export type AuthenticationResponsePublic = z.infer<
  typeof authenticationResponsePublicSchema
>;
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
