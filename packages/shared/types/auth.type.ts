import z from 'zod';
import { JwtPayload } from 'jsonwebtoken';
import {
  authenticationLoginRequestPublicSchema,
  authenticationResponsePublicSchema,
  authenticationRefreshRequestPrivateSchema,
  authenticationRefreshResponsePrivateSchema,
  authenticationRegisterRequestPublicSchema,
  authenticationSuccessResponsePrivateSchema,
  authorizationJwtSchema,
} from '../schemas/auth.schema';

export type AuthenticationRegisterRequestPublicSchema = z.infer<
  typeof authenticationRegisterRequestPublicSchema
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
