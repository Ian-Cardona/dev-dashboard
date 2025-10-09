import {
  authenticationLoginRequestPublicSchema,
  authenticationResponsePublicSchema,
  authenticationRefreshRequestPrivateSchema,
  authenticationRefreshResponsePrivateSchema,
  authenticationEmailRegisterRequestSchema,
  authenticationOAuthRegisterRequestSchema,
  authenticationSuccessResponsePrivateSchema,
  authorizationJwtSchema,
  onboardingSessionDataSchema,
  onboardingOAuthRegisterRequestSchema,
  onboardingEmailRegisterRequestSchema,
} from '../schemas/auth.schema';
import { JwtPayload } from 'jsonwebtoken';
import z from 'zod';

// Onboarding
export type OnboardingEmailRegisterRequestSchema = z.infer<
  typeof onboardingEmailRegisterRequestSchema
>;
export type OnboardingOAuthRegisterRequestSchema = z.infer<
  typeof onboardingOAuthRegisterRequestSchema
>;

// Register
export type AuthenticationEmailRegisterRequestSchema = z.infer<
  typeof authenticationEmailRegisterRequestSchema
>;
export type AuthenticationOAuthRegisterRequestSchema = z.infer<
  typeof authenticationOAuthRegisterRequestSchema
>;

export type AuthenticationLoginRequestPublicSchema = z.infer<
  typeof authenticationLoginRequestPublicSchema
>;
export type AuthenticationSuccessResponsePrivateSchema = z.infer<
  typeof authenticationSuccessResponsePrivateSchema
>;
export type AuthenticationRefreshRequestPrivateSchema = z.infer<
  typeof authenticationRefreshRequestPrivateSchema
>;
export type AuthenticationRefreshResponsePrivateSchema = z.infer<
  typeof authenticationRefreshResponsePrivateSchema
>;
export type AuthenticationResponsePublicSchema = z.infer<
  typeof authenticationResponsePublicSchema
>;
export type AuthorizationJwtSchema = z.infer<typeof authorizationJwtSchema>;
export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  isActive: boolean;
  type: 'access';
}
export interface OnboardingTokenPayload extends JwtPayload {
  jti: string;
  type: 'onboarding';
}
export type OnboardingSessionData = z.infer<typeof onboardingSessionDataSchema>;
