import { HttpResponse } from 'msw';

export async function getPurchaseOrders() {
  const response = await fetch('/api/purchase-orders');
  if (!response.ok) {
    throw new Error('Failed to load purchase order');
  }
  return HttpResponse.json();
}
