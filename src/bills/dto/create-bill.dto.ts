import z from 'zod';

export const createBillSchema = z.object({
  description: z.string(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
  dueDate: z.iso.date(),
});

export type CreateBillDto = z.infer<typeof createBillSchema>;
