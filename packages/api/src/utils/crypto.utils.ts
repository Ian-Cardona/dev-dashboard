import crypto from 'crypto';
import { ENV } from 'src/config/env';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

const getKey = () => {
  const key = ENV.ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    throw new Error(
      '[Encryption] ENCRYPTION_KEY must be 32 characters for AES-256-GCM'
    );
  }
  return Buffer.from(key);
};

export const encrypt = (plainText: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
};

export const decrypt = (encryptedText: string): string => {
  const data = Buffer.from(encryptedText, 'base64');
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = data.subarray(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
};
