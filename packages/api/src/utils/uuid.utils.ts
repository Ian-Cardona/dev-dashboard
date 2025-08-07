import { v4 as uuidv4 } from 'uuid';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types/jwt.type';

export const generateUUID = (): string => uuidv4();

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secure-secret';

export const generateJWT = (
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresIn: number = 60 * 60
): string => {
  const options: SignOptions = {
    expiresIn,
    algorithm: 'HS256',
    issuer: 'your-app',
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJWT = (token: string): JWTPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
  return decoded;
};
