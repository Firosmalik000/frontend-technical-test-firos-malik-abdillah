import type { Inventory } from '@/types/inventory';
import type { PurchaseOrder } from '@/types/purchase-order';
import type { PurchaseRequest } from '@/types/purchase-request';

/**
 * =========================
 * MASTER DATA
 * =========================
 */

export const products = [
  {
    id: 'product-001',
    name: 'Industrial Oil',
    sku: 'OIL-001',
    unit: 'PCS',
  },
  {
    id: 'product-002',
    name: 'Safety Gloves',
    sku: 'GLV-002',
    unit: 'BOX',
  },
  {
    id: 'product-003',
    name: 'Packing Tape',
    sku: 'TAPE-003',
    unit: 'ROLL',
  },
];

export const warehouses = [
  {
    id: 'warehouse-001',
    name: 'Main Warehouse',
  },
  {
    id: 'warehouse-002',
    name: 'Jakarta Hub',
  },
];

export const suppliers = [
  {
    id: 'supplier-001',
    name: 'Pacific Industrial Supply',
  },
  {
    id: 'supplier-002',
    name: 'Global Safety Indonesia',
  },
];

/**
 * =========================
 * PURCHASE REQUESTS
 * =========================
 */

export const purchaseRequests: PurchaseRequest[] = [
  /**
   * Belum menghasilkan PO.
   * Dipakai untuk flow approval.
   */
  {
    id: 'pr-001',
    requestNumber: 'PR-2026-000001',

    warehouseId: 'warehouse-001',
    warehouseName: 'Main Warehouse',

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
        sku: 'GLV-002',
        quantity: 20,
        unit: 'BOX',
      },
    ],
  },

  /**
   * Draft.
   * Belum menghasilkan PO.
   */
  {
    id: 'pr-002',
    requestNumber: 'PR-2026-000002',

    warehouseId: 'warehouse-002',
    warehouseName: 'Jakarta Hub',

    requestedBy: 'Jane Doe',

    status: 'DRAFT',

    createdAt: '2026-09-02T09:30:00.000Z',

    items: [
      {
        productId: 'product-003',
        productName: 'Packing Tape',
        sku: 'TAPE-003',
        quantity: 50,
        unit: 'ROLL',
      },
    ],
  },

  /**
   * Approved PR untuk PO-2026-001.
   */
  {
    id: 'pr-003',
    requestNumber: 'PR-2026-000003',

    warehouseId: 'warehouse-001',
    warehouseName: 'Main Warehouse',

    requestedBy: 'Daniel Wong',

    status: 'APPROVED',

    createdAt: '2026-09-03T08:15:00.000Z',

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
        sku: 'GLV-002',
        quantity: 20,
        unit: 'BOX',
      },
    ],
  },

  /**
   * Approved PR untuk PO-2026-002.
   */
  {
    id: 'pr-004',
    requestNumber: 'PR-2026-000004',

    warehouseId: 'warehouse-002',
    warehouseName: 'Jakarta Hub',

    requestedBy: 'Sarah Lim',

    status: 'APPROVED',

    createdAt: '2026-09-04T10:00:00.000Z',

    items: [
      {
        productId: 'product-003',
        productName: 'Packing Tape',
        sku: 'TAPE-003',
        quantity: 50,
        unit: 'ROLL',
      },
    ],
  },
];

/**
 * =========================
 * PURCHASE ORDERS
 * =========================
 */

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',

    poNumber: 'PO-2026-001',

    /**
     * PO ini berasal dari PR-003
     */
    purchaseRequestId: 'pr-003',

    supplier: 'Pacific Industrial Supply',

    warehouseId: 'warehouse-001',
    warehouseName: 'Main Warehouse',

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
        sku: 'GLV-002',

        orderedQuantity: 20,
        receivedQuantity: 0,

        unit: 'BOX',
      },
    ],
  },

  {
    id: 'po-002',

    poNumber: 'PO-2026-002',

    /**
     * PO ini berasal dari PR-004
     */
    purchaseRequestId: 'pr-004',

    supplier: 'Global Safety Indonesia',

    warehouseId: 'warehouse-002',
    warehouseName: 'Jakarta Hub',

    status: 'PARTIALLY_RECEIVED',

    createdAt: '2026-09-11T08:00:00.000Z',

    items: [
      {
        productId: 'product-003',
        productName: 'Packing Tape',
        sku: 'TAPE-003',

        orderedQuantity: 50,
        receivedQuantity: 20,

        unit: 'ROLL',
      },
    ],
  },
];

/**
 * =========================
 * INVENTORY
 * =========================
 */

export const inventories: Inventory[] = [
  {
    id: 'inventory-001',

    productId: 'product-001',
    productName: 'Industrial Oil',
    sku: 'OIL-001',

    warehouseId: 'warehouse-001',
    warehouseName: 'Main Warehouse',

    currentStock: 120,

    unit: 'PCS',
  },

  {
    id: 'inventory-002',

    productId: 'product-002',
    productName: 'Safety Gloves',
    sku: 'GLV-002',

    warehouseId: 'warehouse-001',
    warehouseName: 'Main Warehouse',

    currentStock: 40,

    unit: 'BOX',
  },

  {
    id: 'inventory-003',

    productId: 'product-003',
    productName: 'Packing Tape',
    sku: 'TAPE-003',

    warehouseId: 'warehouse-002',
    warehouseName: 'Jakarta Hub',

    currentStock: 80,

    unit: 'ROLL',
  },
];

/**
 * =========================
 * MOCK DATABASE
 * =========================
 */

export const db = {
  products,
  warehouses,
  suppliers,

  purchaseRequests,
  purchaseOrders,
  inventories,
};
