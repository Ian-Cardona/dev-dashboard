import z from 'zod';

export const redisTypedSchema = {
  jti: z.string().min(1).max(255),
  type: z.enum(['register-init', 'register', 'login']),
};
