import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { ENV } from '../config/env_variables';

export const generateJWT = (payload: object): string => {
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

export const verifyJWT = <T extends JwtPayload = JwtPayload>(
  token: string
): T => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const verifyOptions: VerifyOptions = {
    algorithms: ['HS256'],
    issuer: ENV.APP_NAME,
    audience: ENV.CLIENT_APP_NAME,
  };

  return jwt.verify(token, ENV.JWT_SECRET, verifyOptions) as T;
};
