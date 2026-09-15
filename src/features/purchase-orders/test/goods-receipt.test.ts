import { getInventories } from '@/api/inventory';
import { getPurchaseOrders, recordGoodReceipt } from '@/api/purchase-order';
import { describe, expect, it } from 'vitest';

describe('Good receipt integration ', () => {
  it('updates inventory stock and purchase order after receiving good', async () => {
    const purchaseOrders = await getPurchaseOrders();
    const inventories = await getInventories();
    const purchaseOrder = purchaseOrders.find((order) => order.status === 'ORDERED' || order.status === 'PARTIALLY_RECEIVED');
    expect(purchaseOrder).toBeDefined();

    if (!purchaseOrder) {
      throw new Error('No receivable purchase order found');
    }
    const orderItem = purchaseOrder.items.find((item) => {
      const inventoryItem = inventories.find((inventory) => inventory.productId === item.productId && inventory.warehouseId === purchaseOrder.warehouseId);

      return Boolean(inventoryItem);
    });
    expect(orderItem).toBeDefined();
    if (!orderItem) {
      throw new Error('No purchase order with inventory matching found');
    }

    const inventoryBefore = inventories.find((item) => item.productId === orderItem.productId && item.warehouseId === purchaseOrder.warehouseId);

    expect(inventoryBefore).toBeDefined();

    if (!inventoryBefore) {
      throw new Error('matching inventory not found');
    }

    const stockBefore = inventoryBefore.currentStock;

    const receivedBefore = orderItem.receivedQuantity;

    const result = await recordGoodReceipt(purchaseOrder.id, { items: [{ productId: orderItem.productId, quantity: 1 }] });

    const inventoriesAfter = await getInventories();

    const inventoryAfter = inventoriesAfter.find((inventory) => inventory.productId === orderItem.productId && inventory.warehouseId === purchaseOrder.warehouseId);

    expect(inventoryAfter).toBeDefined();

    expect(inventoryAfter?.currentStock).toBe(stockBefore + 1);

    const updateOrderItem = result.items.find((item) => item.productId === orderItem.productId);

    expect(updateOrderItem?.receivedQuantity).toBe(receivedBefore + 1);

    expect(['PARTIALLY_RECEIVED', 'ORDERED']).toContain(result.status);
  });
});
