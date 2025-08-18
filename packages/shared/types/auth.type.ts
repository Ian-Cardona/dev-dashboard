import z from 'zod';
import { JwtPayload } from 'jsonwebtoken';
import {
  authenticationRegisterRequestSchema,
  authenticationLoginRequestSchema,
  authenticationRefreshRequestSchema,
  authenticationSuccessResponseSchema,
  authenticationRefreshResponseSchema,
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

// JWT Payload
export interface AuthorizationTokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

// import { JwtPayload } from 'jsonwebtoken';
// import { ResponseUser } from './user.type';

// // Authentication
// export type AuthenticationRegisterRequest = {
//   email: string;
//   password: string;
//   firstName?: string;
//   lastName?: string;
// };

// export type AuthenticationLoginRequest = {
//   email: string;
//   password: string;
// };

// export interface AuthenticationSuccessResponse {
//   accessToken: string;
//   refreshToken: string;
//   user: ResponseUser;
// }

// // Refresh Token
// export type AuthenticationRefreshRequest = {
//   userId: string;
//   refreshToken: string;
// };

// export type AuthenticationRefreshResponse = Omit<
//   AuthenticationSuccessResponse,
//   'user'
// >;

// // Authorization
// export interface AuthorizationTokenPayload extends JwtPayload {
//   userId: string;
//   email: string;
//   role?: 'user' | 'admin';
// }
