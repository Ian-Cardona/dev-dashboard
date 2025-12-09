import bcrypt from 'bcryptjs';

export const bcryptCompare = async (plainText: string, hash: string) =>
  await bcrypt.compare(plainText, hash);

export const isBcryptHash = (value: string): boolean => {
  return /^\$2[aby]\$.{56}$/.test(value);
};

export const bcryptGen = async (plainText: string, saltRounds: number) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainText, salt);
};
