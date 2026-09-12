import type { PurchaseRequest } from '../../types/purchase-request';

export const purchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr-001',
    requestNumber: 'PR-2026-000001',
    warehouseId: 'wh-jakarta',
    warehouseName: 'Jakarta Warehouse',
    requestedBy: 'John Doe',
    status: 'SUBMITTED',
    createdAt: '2026-09-01T08:00:00.000Z',
    items: [
      {
        productId: 'product-001',
        productName: 'Industrial Oil',
        sku: 'OIL-001',
        quantity: 100,
        unit: 'PCS',
      },
      {
        productId: 'product-002',
        productName: 'Safety Gloves',
        sku: 'SAFE-001',
        quantity: 20,
        unit: 'BOX',
      },
    ],
  },
  {
    id: 'pr-002',
    requestNumber: 'PR-2026-000002',
    warehouseId: 'wh-bandung',
    warehouseName: 'Bandung Warehouse',
    requestedBy: 'Jane Doe',
    status: 'DRAFT',
    createdAt: '2026-09-02T09:30:00.000Z',
    items: [
      {
        productId: 'product-003',
        productName: 'Packing Tape',
        sku: 'PACK-001',
        quantity: 50,
        unit: 'ROLL',
      },
    ],
  },
];
