import { HttpResponse } from 'msw';
import type { PurchaseRequest } from '../types/purchase-request';

export async function getPurchaseRequests(): Promise<PurchaseRequest[]> {
  const response = await fetch('/api/purchase-requests');

  if (!response.ok) {
    throw new Error('Failed to load purchase requests');
  }

  return response.json();
}

export async function getPurchaseRequestById(id: string): Promise<PurchaseRequest> {
  const response = await fetch(`/api/purchase-requests/${id}`);
  if (!response.ok) {
    throw new Error('Failed to load purchase requests');
  }
  return response.json();
}

export type PurchaseRequestInput = {
  warehouseId: string;
  requestedBy: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

export async function createPurchaseRequest(data: PurchaseRequestInput): Promise<PurchaseRequest> {
  const response = await fetch('/api/purchase-requests', {
    method: 'POST',
    headers: {
      'Conten-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create purchase request');
  }
  return response.json();
}

export async function updatePurchaseRequest(id: string, data: PurchaseRequestInput): Promise<PurchaseRequest> {
  const response = await fetch(`/api/purchase-requests/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application.json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update purchase request');
  }
  return response.json();
}
