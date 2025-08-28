import bcrypt from 'bcryptjs';

export const bcryptCompare = async (plainText: string, hash: string) =>
  await bcrypt.compare(plainText, hash);
