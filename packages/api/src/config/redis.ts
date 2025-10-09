import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect();
