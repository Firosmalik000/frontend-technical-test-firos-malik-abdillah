import { z } from 'zod';
export const purchaseRequestFormSchema = z.object({
  warehouseId: z.string().min(1, 'Warehouse is required'),
  requestedBy: z.string().min(1, 'Requested By is required'),

  items: z.array(z.object({ productId: z.string().min(1, 'Product is required'), quantity: z.number().min(1, 'Quantity must be at least 1') })).min(1, 'At least one item is required'),
});

export type PurchaseRequestFormValues = z.infer<typeof purchaseRequestFormSchema>;
