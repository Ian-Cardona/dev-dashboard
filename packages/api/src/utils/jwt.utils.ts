import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/env_variables';

export const generateJWT = (payload: object): string => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const signOptions: SignOptions = {
    expiresIn: parseInt(ENV.JWT_EXPIRES_IN_SECONDS, 10),
    algorithm: 'HS256',
  };

  return jwt.sign(payload, ENV.JWT_SECRET, signOptions);
};

export const verifyJWT = (token: string) => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, ENV.JWT_SECRET);
};
