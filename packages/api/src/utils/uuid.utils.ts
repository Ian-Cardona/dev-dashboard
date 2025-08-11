import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const generateUUID = (): string => uuidv4();

export const generateSecureRefreshToken = (): string =>
  crypto.randomBytes(64).toString('hex');
