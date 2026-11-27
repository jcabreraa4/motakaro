import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    surname: z.string().min(1, 'Surname is required'),
    password: z.string().min(1, 'Password is required').min(6, 'Password is too short'),
    confirm: z.string().min(1, 'Password is required')
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm']
  });

export type SignUpFormType = z.infer<typeof signUpSchema>;
