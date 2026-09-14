import type { Inventory } from '@/types/inventory';

export const inventories: Inventory[] = [
  {
    id: '1',
    productId: 'product-001',
    productName: 'Industrial Oil',
    sku: 'OIL-001',
    warehouseId: 'wh-jakarta',
    warehouseName: 'Jakarta Warehouse',
    currentStock: 120,
    unit: 'PCS',
  },
  {
    id: '2',
    productId: 'product-002',
    productName: 'Safety Gloves',
    sku: 'SAFE-001',
    warehouseId: 'wh-jakarta',
    warehouseName: 'Jakarta Warehouse',
    currentStock: 40,
    unit: 'BOX',
  },
  {
    id: '3',
    productId: 'product-003',
    productName: 'Packing Tape',
    sku: 'PACK-001',
    warehouseId: 'wh-bandung',
    warehouseName: 'Bandung Warehouse',
    currentStock: 80,
    unit: 'ROLL',
  },
];
