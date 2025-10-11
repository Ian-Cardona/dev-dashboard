import { ENV } from '../config/env_variables';
import { UnauthorizedError } from './errors.utils';
import {
  AccessTokenPayload,
  RegisterInitTokenPayload,
} from '@dev-dashboard/shared';
import { Request } from 'express';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

export const generateAccessJWT = (payload: AccessTokenPayload): string => {
  const signOptions: SignOptions = {
    expiresIn: '30m',
    algorithm: 'HS256',
    issuer: ENV.APP_NAME,
    audience: ENV.CLIENT_APP_NAME,
  };

  return jwt.sign(payload, ENV.JWT_SECRET, signOptions);
};

export const generateRegisterInitJWT = (
  payload: RegisterInitTokenPayload
): string => {
  const signOptions: SignOptions = {
    expiresIn: '1h',
    algorithm: 'HS256',
    issuer: ENV.APP_NAME,
    audience: ENV.CLIENT_APP_NAME,
  };

  return jwt.sign(payload, ENV.JWT_SECRET, signOptions);
};

export const verifyJWT = <T extends object>(token: string): T => {
  try {
    const verifyOptions: VerifyOptions = {
      algorithms: ['HS256'],
      issuer: ENV.APP_NAME,
      audience: ENV.CLIENT_APP_NAME,
    };

    return jwt.verify(token, ENV.JWT_SECRET, verifyOptions) as T;
  } catch {
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
