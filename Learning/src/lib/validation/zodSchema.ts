import z from 'zod';

export const createUserSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    username: z.string().min(4, 'Username must be at least 4 characters long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be 32 characters or less')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[^a-zA-Z0-9]/,
        'Password must contain at least one special character',
      ),
  })
  .required();

export type CreateUser = z.infer<typeof createUserSchema>;
