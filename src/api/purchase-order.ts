import type { PurchaseOrder } from '@/types/purchase-order';

export async function getPurchaseOrders(): Promise<PurchaseOrder> {
  const response = await fetch('/api/purchase-orders');
  if (!response.ok) {
    throw new Error('Failed to load purchase order');
  }
  return response.json();
}

export async function getPurchaseOrdersById(id: string): Promise<PurchaseOrder> {
  const response = await fetch(`/api/purchase-orders/${id}`);
  if (!response.ok) {
    throw new Error('Failed to load purchase order');
  }
  return response.json();
}

export type GoodsReceiptInput = { items: { productId: string; quantity: number }[] };

export async function recordGoodReceipt(id: string, data: GoodsReceiptInput): Promise<PurchaseOrder> {
  const response = await fetch(`/api/purchase-orders/${id}/receipt`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to record goods receipt');
  }

  return response.json();
}
