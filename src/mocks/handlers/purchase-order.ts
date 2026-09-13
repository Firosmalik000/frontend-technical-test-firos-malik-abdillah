import { delay, http, HttpResponse } from 'msw';
import { purchaseOrders } from '../data/purchase-order';

export const purchaseOrderHandler = [
  http.get('/api/purchase-orders', async () => {
    await delay(500);

    return HttpResponse.json(purchaseOrders);
  }),
];
