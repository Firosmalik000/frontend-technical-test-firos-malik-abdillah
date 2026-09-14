import { delay, http, HttpResponse } from 'msw';
import { purchaseOrders } from '../data/purchase-order';

export const purchaseOrderHandler = [
  http.get('/api/purchase-orders', async () => {
    await delay(500);

    return HttpResponse.json(purchaseOrders);
  }),
  http.get(`/api/purchase-orders/:id`, async ({ params }) => {
    await delay(500);
    const data = purchaseOrders.find((item) => item.id === params.id);

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

    const purchaseOrder = purchaseOrders.find((order) => order.id === params.id);

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

      const remainingQty = orderItem.orderedQuantity - orderItem.receivedQuantity;

      if (receivedItem.quantity <= 0 || receivedItem.quantity > remainingQty) {
        return HttpResponse.json({ message: 'Invalid receive quantity' }, { status: 400 });
      }
    }

    for (const receivedItem of body.items) {
      const orderItem = purchaseOrder.items.find((item) => item.productId === receivedItem.productId);

      if (orderItem) {
        orderItem.receivedQuantity += receivedItem.quantity;
      }
    }

    const isFullyReceived = purchaseOrder.items.every((item) => item.receivedQuantity === item.orderedQuantity);

    purchaseOrder.status = isFullyReceived ? 'RECEIVED' : 'PARTIALLY_RECEIVED';

    return HttpResponse.json(purchaseOrder);
  }),
];
