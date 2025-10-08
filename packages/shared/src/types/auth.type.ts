import {
  authenticationLoginRequestPublicSchema,
  authenticationResponsePublicSchema,
  authenticationRefreshRequestPrivateSchema,
  authenticationRefreshResponsePrivateSchema,
  authenticationEmailRegisterRequestSchema,
  authenticationOAuthRegisterRequestSchema,
  authenticationSuccessResponsePrivateSchema,
  authorizationJwtSchema,
} from '../schemas/auth.schema';
import { JwtPayload } from 'jsonwebtoken';
import z from 'zod';

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
export interface AuthorizationTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  isActive: boolean;
}
export interface OnboardingTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  type: 'onboarding';
}
