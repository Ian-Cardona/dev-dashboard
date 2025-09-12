import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { ENV } from '../config/env_variables';
import { Request } from 'express';
import { AuthorizationTokenPayload } from '@dev-dashboard/shared';
import { UnauthorizedError } from './errors.utils';

export const generateJWT = (payload: AuthorizationTokenPayload): string => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const signOptions: SignOptions = {
    expiresIn: '30m',
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

  try {
    return jwt.verify(
      token,
      ENV.JWT_SECRET,
      verifyOptions
    ) as AuthorizationTokenPayload;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

export const extractBearerToken = (req: Request): string => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || Array.isArray(authHeader))
    throw new UnauthorizedError('No authorization header');

  const parts = authHeader.split(' ');
  if (parts.length !== 2)
    throw new UnauthorizedError('Invalid authorization header');

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    throw new UnauthorizedError('Invalid authorization header');

  return token;
};
