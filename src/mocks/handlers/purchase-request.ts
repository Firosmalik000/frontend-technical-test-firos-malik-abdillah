import { delay, http, HttpResponse } from 'msw';

import { purchaseRequests } from '../data/purchase-requests';

export const purchaseRequestHandlers = [
  http.get('/api/purchase-requests', async () => {
    await delay(500);

    return HttpResponse.json(purchaseRequests);
  }),
];
