import { ENV } from './env';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

export const redisClient: RedisClientType = createClient({
  url: ENV.REDIS_URL,
});

redisClient.connect();
