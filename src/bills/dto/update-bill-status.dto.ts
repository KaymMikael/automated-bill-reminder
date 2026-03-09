import z from 'zod';

export const updateBillStatusSchema = z.object({
  newBillStatus: z.enum(['pending', 'paid']),
});

export type UpdateBillStatusDto = z.infer<typeof updateBillStatusSchema>;
