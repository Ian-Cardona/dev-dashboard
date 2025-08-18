import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { ENV } from '../config/env_variables';
import { AuthorizationTokenPayload } from '../../../shared/types/auth.type';
import { Request } from 'express';

export const generateJWT = (payload: AuthorizationTokenPayload): string => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const signOptions: SignOptions = {
    expiresIn: '30m', // TODO: Use env variable for this
    algorithm: 'HS256',
    issuer: ENV.APP_NAME,
    audience: ENV.CLIENT_APP_NAME,
  };

  return jwt.sign(payload, ENV.JWT_SECRET, signOptions);
};

export const verifyJWT = (token: string): AuthorizationTokenPayload => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const verifyOptions: VerifyOptions = {
    algorithms: ['HS256'],
    issuer: ENV.APP_NAME,
    audience: ENV.CLIENT_APP_NAME,
  };

  return jwt.verify(
    token,
    ENV.JWT_SECRET,
    verifyOptions
  ) as AuthorizationTokenPayload;
};

export const extractBearerToken = (req: Request): string => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || Array.isArray(authHeader))
    throw new Error('No authorization header');

  const parts = authHeader.split(' ');
  if (parts.length !== 2) throw new Error('Invalid authorization header');

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    throw new Error('Invalid authorization header');

  return token;
};
