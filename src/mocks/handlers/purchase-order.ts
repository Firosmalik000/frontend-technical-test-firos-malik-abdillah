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

    const data = purchaseOrders.find((item) => item.id === params.id);

    if (!data) {
      return HttpResponse.json({ message: 'Purchase Order not found' }, { status: 404 });
    }

    if (data.status !== 'ORDERED' && data.status !== 'PARTIALLY_RECEIVED') {
      {
        return HttpResponse.json({ message: 'Purchase Order cannot receive goods' }, { status: 400 });
      }
    }
    const body = (await request.json()) as {
      items: {
        productId: string;
        quantity: number;
      }[];
    };

    for (const receiptItem of body.items) {
      const items = data.items.find((item) => item.productId === receiptItem.productId);
      if (!items) {
        return HttpResponse.json({ message: 'Product not found' }, { status: 400 });
      }
      const remaining = items.orderedQuantity - items.receivedQuantity;
      if (receiptItem.quantity <= 0 || receiptItem.quantity > remaining) {
        return HttpResponse.json({ message: 'Invalid receive quantity' }, { status: 400 });
      }

      body.items.forEach((receiptItem) => {
        const item = data.items.find((prod) => prod.productId === receiptItem.productId);
        if (item) item.receivedQuantity += receiptItem.quantity;
      });
    }
    const allReceived = data.items.every((item) => item.receivedQuantity === item.receivedQuantity);
    data.status = allReceived ? 'RECEIVED' : 'PARTIALLY_RECEIVED';

    return HttpResponse.json(data);
  }),
];
