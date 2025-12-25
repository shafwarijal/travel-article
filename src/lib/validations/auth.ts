import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(20, { message: 'Username must not exceed 20 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
      }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(50, { message: 'Password must not exceed 50 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
