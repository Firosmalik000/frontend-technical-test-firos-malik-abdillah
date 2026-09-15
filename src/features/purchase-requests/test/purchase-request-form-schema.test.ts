import { describe, expect, it } from 'vitest';
import { purchaseRequestFormSchema } from '../purchase-request-form-schema';
import { approvePurchaseRequest, createPurchaseRequest, rejectPurchaseRequest, submitPurchaseRequest } from '@/api/purchase-requests';

describe('purchaseRequestFormSchema', () => {
  it('accept if valid purchase request', () => {
    const result = purchaseRequestFormSchema.safeParse({
      warehouseId: 'wh-jakarta',
      requestedBy: 'John Doe',
      items: [{ productId: 'product=001', quantity: 10 }],
    });
    expect(result.success).toBe(true);
  });
  it('reject if invalid purchase request', () => {
    const result = purchaseRequestFormSchema.safeParse({
      warehouseId: '',
      requestedName: 'John Doe',
      items: [{ productId: 'product-001', quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });
});

describe('Purchase Request approval', () => {
  it('changes SUBMITTED purchase request to APPROVED', async () => {
    const create = await createPurchaseRequest({
      warehouseId: 'wh-jakarta',
      requestedBy: 'John Doe',
      items: [{ productId: 'product-001', quantity: 5 }],
    });
    const submitted = await submitPurchaseRequest(create.id);
    expect(submitted.status).toBe('SUBMITTED');

    const result = await approvePurchaseRequest(submitted.id);
    expect(result.status).toBe('APPROVED');
  });
});

describe('Purchase request reject', () => {
  it('changes SUBMITTED purchase request to APPROVED', async () => {
    const create = await createPurchaseRequest({
      warehouseId: 'wh-jakarta',
      requestedBy: 'John Doe',
      items: [{ productId: 'product-001', quantity: 5 }],
    });
    const submitted = await submitPurchaseRequest(create.id);
    expect(submitted.status).toBe('SUBMITTED');
    const rejectionReason = 'Test rejection';
    const result = await rejectPurchaseRequest(submitted.id, rejectionReason);
    expect(result.status).toBe('REJECTED');
  });
});
