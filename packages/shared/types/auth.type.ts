import z from 'zod';
import { JwtPayload } from 'jsonwebtoken';
import {
  authenticationRegisterRequestSchema,
  authenticationLoginRequestSchema,
  authenticationRefreshRequestSchema,
  authenticationSuccessResponseSchema,
  authenticationJWTResponseSchema,
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
export type AuthenticationJWTResponse = z.infer<
  typeof authenticationJWTResponseSchema
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
  isActive: boolean;
}
