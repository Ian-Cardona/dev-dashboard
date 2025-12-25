import { ENV } from './env';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

export const redisClient: RedisClientType = createClient({
  url: ENV.REDIS_URL,
});

redisClient.on('error', err => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

redisClient.on('ready', () => {
  console.log('Redis Client Ready');
});

redisClient.connect().catch(err => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);
});
