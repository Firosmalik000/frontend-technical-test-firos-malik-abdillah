import { delay, http, HttpResponse } from 'msw';

import { purchaseRequests } from '../data/purchase-requests';

export const purchaseRequestHandlers = [
  http.get('/api/purchase-requests', async () => {
    await delay(500);

    return HttpResponse.json(purchaseRequests);
  }),
  // request by id
  http.get(`/api/purchase-requests/:id`, async ({ params }) => {
    await delay(500);

    const purchaseRequestById = purchaseRequests.find((item) => item.id === params.id);
    if (!purchaseRequestById) {
      return HttpResponse.json(
        {
          message: 'Purchase Request not found',
        },
        {
          status: 404,
        },
      );
    }

    return HttpResponse.json(purchaseRequestById);
  }),
];
