import { delay, http, HttpResponse } from 'msw';
import { inventories } from '../data/inventory';

export const inventoryHandlers = [
  http.get('/api/inventory', async () => {
    await delay(500);

    return HttpResponse.json(inventories);
  }),
  http.get(`/api/inventory/:id`, async ({ params }) => {
    await delay(500);
    const data = inventories.find((item) => item.id === params.id);

    if (!data) return HttpResponse.json({ message: 'Inventory is not found' }, { status: 404 });

    return HttpResponse.json(data);
  }),
];
