import { delay, http, HttpResponse } from 'msw';
import { db } from '../data/data';

export const purchaseOrderHandler = [
  http.get('/api/purchase-orders', async () => {
    await delay(500);

    return HttpResponse.json(db.purchaseOrders);
  }),
  http.get(`/api/purchase-orders/:id`, async ({ params }) => {
    await delay(500);
    const data = db.purchaseOrders.find((item) => item.id === params.id);

    if (!data) {
      return HttpResponse.json(
        {
          message: 'Purchase Order is not found',
        },
        {
          status: 404,
        },
      );
    }

    return HttpResponse.json(data);
  }),
  http.post('/api/purchase-orders/:id/receipt', async ({ params, request }) => {
    await delay(500);

    const purchaseOrder = db.purchaseOrders.find((order) => order.id === params.id);

    if (!purchaseOrder) {
      return HttpResponse.json({ message: 'Purchase Order not found' }, { status: 404 });
    }

    if (purchaseOrder.status !== 'ORDERED' && purchaseOrder.status !== 'PARTIALLY_RECEIVED') {
      return HttpResponse.json({ message: 'Purchase Order cannot receive goods' }, { status: 400 });
    }

    const body = (await request.json()) as {
      items: {
        productId: string;
        quantity: number;
      }[];
    };

    for (const receivedItem of body.items) {
      const orderItem = purchaseOrder.items.find((item) => item.productId === receivedItem.productId);

      if (!orderItem) {
        return HttpResponse.json({ message: 'Product not found' }, { status: 400 });
      }
      const inventory = db.inventories.find((item) => item.productId === receivedItem.productId && item.warehouseId === purchaseOrder.warehouseId);

      if (!inventory) return HttpResponse.json({ message: 'Inventory item is not found' }, { status: 400 });

      const remainingQty = orderItem.orderedQuantity - orderItem.receivedQuantity;

      if (receivedItem.quantity <= 0 || receivedItem.quantity > remainingQty) {
        return HttpResponse.json({ message: 'Invalid receive quantity' }, { status: 400 });
      }
    }

    for (const receivedItem of body.items) {
      const orderItem = purchaseOrder.items.find((item) => item.productId === receivedItem.productId);
      const inventoryItem = db.inventories.find((item) => item.productId === receivedItem.productId && item.warehouseId === purchaseOrder.warehouseId);

      if (orderItem && inventoryItem) {
        orderItem.receivedQuantity += receivedItem.quantity;

        inventoryItem.currentStock += receivedItem.quantity;
      }
    }

    const isFullyReceived = purchaseOrder.items.every((item) => item.receivedQuantity === item.orderedQuantity);

    purchaseOrder.status = isFullyReceived ? 'RECEIVED' : 'PARTIALLY_RECEIVED';

    return HttpResponse.json(purchaseOrder);
  }),
];
