import { redisClient } from '../config/redis';

export const redisGetJSON = async <T = unknown>(
  key: string
): Promise<T | null> => {
  const raw = await redisClient.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

export const redisSetJSON = async (
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> => {
  const payload = JSON.stringify(value);
  if (typeof ttlSeconds === 'number') {
    await redisClient.set(key, payload, { EX: ttlSeconds });
  } else {
    await redisClient.set(key, payload);
  }
};

export const redisDel = async (key: string): Promise<number> => {
  return redisClient.del(key);
};
