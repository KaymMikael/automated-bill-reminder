import z from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .max(50)
    .regex(/^[a-zA-Z ]*$/, {
      error: 'Name can contain only letters and space',
    })
    .trim(),
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, { error: 'Password must have at least 8 characters' }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
