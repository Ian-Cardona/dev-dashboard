import { userSchema, userResponsePublicSchema } from '../schemas/user.schema';
import z from 'zod';

export type User = z.infer<typeof userSchema>;
export type UserResponsePublic = z.infer<typeof userResponsePublicSchema>;
