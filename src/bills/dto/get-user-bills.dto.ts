import z from 'zod';

export const getUserBillsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().optional(),
  sortedBy: z.enum(['amount', 'dueDate']).default('dueDate'),
  orderBy: z.enum(['asc', 'desc']).default('desc'),
});

export type GetUserBillsDto = z.infer<typeof getUserBillsSchema>;
