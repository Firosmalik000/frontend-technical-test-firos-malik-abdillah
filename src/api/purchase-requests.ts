import type { PurchaseRequest } from '../types/purchase-request';

export async function getPurchaseRequests(): Promise<PurchaseRequest[]> {
  const response = await fetch('/api/purchase-requests');

  if (!response.ok) {
    throw new Error('Failed to load purchase requests');
  }

  return response.json();
}
