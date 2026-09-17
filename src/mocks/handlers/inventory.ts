import { delay, http, HttpResponse } from 'msw';
import { db } from '../data/data';

export const inventoryHandlers = [
  http.get('/api/inventory', async () => {
    await delay(500);

    return HttpResponse.json(db.inventories);
  }),
  http.get(`/api/inventory/:id`, async ({ params }) => {
    await delay(500);
    const data = db.inventories.find((item) => item.id === params.id);

    if (!data) return HttpResponse.json({ message: 'Inventory is not found' }, { status: 404 });

    return HttpResponse.json(data);
  }),
];
