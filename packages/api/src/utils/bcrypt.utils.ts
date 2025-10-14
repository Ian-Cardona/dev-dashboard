import bcrypt from 'bcryptjs';

export const bcryptCompare = async (plainText: string, hash: string) =>
  await bcrypt.compare(plainText, hash);

export const isBcryptHash = (value: string): boolean => {
  return /^\$2[aby]\$.{56}$/.test(value);
};
