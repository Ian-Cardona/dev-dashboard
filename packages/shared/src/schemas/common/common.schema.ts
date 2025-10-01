import z from 'zod';

export const uuidSchema = z.uuidv4({ message: 'Invalid UUID' });
export const emailSchema = z.email({ message: 'Invalid email' });
