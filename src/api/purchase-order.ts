import type { PurchaseOrder } from '@/types/purchase-order';

export async function getPurchaseOrders(): Promise<PurchaseOrder> {
  const response = await fetch('/api/purchase-orders');
  if (!response.ok) {
    throw new Error('Failed to load purchase order');
  }
  return response.json();
}
