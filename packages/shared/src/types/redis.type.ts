import { redisTypedSchema } from '../schemas/redis.schema';
import z from 'zod';

export type RedisTyped = z.infer<typeof redisTypedSchema>;
