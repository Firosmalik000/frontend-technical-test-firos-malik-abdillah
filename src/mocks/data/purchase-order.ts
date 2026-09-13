import type { PurchaseOrder } from '@/types/purchase-order';

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2026-001',
    supplier: 'PT Sumber Industri',
    warehouseId: 'wh-jakarta',
    warehouseName: 'Jakarta Warehouse',
    status: 'ORDERED',
    createdAt: '2026-09-10T08:00:00.000Z',
    items: [
      {
        productId: 'product-001',
        productName: 'Industrial Oil',
        sku: 'OIL-001',
        orderedQuantity: 100,
        receivedQuantity: 0,
        unit: 'PCS',
      },
      {
        productId: 'product-002',
        productName: 'Safety Gloves',
        sku: 'SAFE-001',
        orderedQuantity: 20,
        receivedQuantity: 0,
        unit: 'BOX',
      },
    ],
  },
  {
    id: '2',
    poNumber: 'PO-2026-002',
    supplier: 'PT Mitra Safety',
    warehouseId: 'wh-bandung',
    warehouseName: 'Bandung Warehouse',
    status: 'PARTIALLY_RECEIVED',
    createdAt: '2026-09-11T08:00:00.000Z',
    items: [
      {
        productId: 'product-003',
        productName: 'Packing Tape',
        sku: 'PACK-001',
        orderedQuantity: 50,
        receivedQuantity: 20,
        unit: 'ROLL',
      },
    ],
  },
];
