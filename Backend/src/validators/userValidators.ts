import { z } from 'zod';
import { ROLES } from '../types';

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(ROLES).default('member'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
