import z from 'zod';
import { userSchema, userResponsePublicSchema } from '../schemas/user.schema';

export type User = z.infer<typeof userSchema>;
export type UserResponsePublic = z.infer<typeof userResponsePublicSchema>;
