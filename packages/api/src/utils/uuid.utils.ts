import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const generateUUID = (): string => uuidv4();

export const generateRefreshToken = (): string =>
  crypto.randomBytes(64).toString('hex');
