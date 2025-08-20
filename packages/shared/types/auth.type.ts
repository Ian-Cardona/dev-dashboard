import z from 'zod';
import { JwtPayload } from 'jsonwebtoken';
import {
  authenticationRegisterRequestSchema,
  authenticationLoginRequestSchema,
  authenticationRefreshRequestSchema,
  authenticationSuccessResponseSchema,
  authenticationRefreshResponseSchema,
  authenticationSuccessServiceSchema,
  authenticationRefreshServiceSchema,
} from '../schemas/auth.schema';

export type AuthenticationRegisterRequest = z.infer<
  typeof authenticationRegisterRequestSchema
>;
export type AuthenticationLoginRequest = z.infer<
  typeof authenticationLoginRequestSchema
>;
export type AuthenticationRefreshRequest = z.infer<
  typeof authenticationRefreshRequestSchema
>;

export type AuthenticationSuccessResponse = z.infer<
  typeof authenticationSuccessResponseSchema
>;
export type AuthenticationRefreshResponse = z.infer<
  typeof authenticationRefreshResponseSchema
>;
export type AuthenticationSuccessService = z.infer<
  typeof authenticationSuccessServiceSchema
>;
export type AuthenticationRefreshService = z.infer<
  typeof authenticationRefreshServiceSchema
>;

// JWT Payload
export interface AuthorizationTokenPayload extends JwtPayload {
  userId: string;
  email: string;
}
