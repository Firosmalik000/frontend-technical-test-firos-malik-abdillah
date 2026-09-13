import { delay, http, HttpResponse } from 'msw';

import { purchaseRequests } from '../data/purchase-requests';
const warehouses = [
  {
    id: 'wh-jakarta',
    name: 'Jakarta Warehouse',
  },
  {
    id: 'wh-bandung',
    name: 'Bandung Warehouse',
  },
];

const products = [
  {
    id: 'product-001',
    name: 'Industrial Oil',
    sku: 'OIL-001',
    unit: 'PCS',
  },
  {
    id: 'product-002',
    name: 'Safety Gloves',
    sku: 'SAFE-001',
    unit: 'BOX',
  },
  {
    id: 'product-003',
    name: 'Packing Tape',
    sku: 'PACK-001',
    unit: 'ROLL',
  },
];
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
  http.post('/api/purchase-requests', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { warehouseId: string; requestedBy: string; items: { productId: string; quantity: number }[] };
    const id = String(purchaseRequests.length + 1);

    const warehouse = warehouses.find((item) => item.id === body.warehouseId);

    const newItem = {
      id: id,
      requestNumber: `PR-${id}`,
      warehouseId: body.warehouseId,
      warehouseName: warehouse?.name ?? '-',
      requestedBy: body.requestedBy,
      status: 'DRAFT' as const,
      createdAt: new Date().toISOString(),
      items: body.items.map((item) => {
        const product = products.find((prod) => prod.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name ?? '-',
          sku: product?.sku ?? '-',
          quantity: Number(item.quantity),
          unit: product?.unit ?? '-',
        };
      }),
    };

    purchaseRequests.push(newItem);

    return HttpResponse.json(newItem, { status: 201 });
  }),
  http.put('/api/purchase-requests/:id', async ({ params, request }) => {
    await delay(500);

    const body = (await request.json()) as { warehouseId: string; requestedBy: string; items: { productId: string; quantity: number }[] };

    const index = purchaseRequests.findIndex((item) => item.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Purchase Request not found' }, { status: 404 });
    }

    if (purchaseRequests[index].status !== 'DRAFT') {
      return HttpResponse.json({ message: 'Only DRAFT can be edited' }, { status: 400 });
    }

    const warehouseName = body.warehouseId === 'wh-jakarta' ? 'Jakarta Warehouse' : 'Bandung Warehouse';

    const items = body.items.map((item) => {
      if (item.productId === 'product-001') {
        return {
          ...item,
          productName: 'Industrial Oil',
          sku: 'OIL-001',
          unit: 'PCS',
        };
      }

      if (item.productId === 'product-002') {
        return {
          ...item,
          productName: 'Safety Gloves',
          sku: 'SAFE-001',
          unit: 'BOX',
        };
      }

      return {
        ...item,
        productName: 'Packing Tape',
        sku: 'PACK-001',
        unit: 'ROLL',
      };
    });

    purchaseRequests[index] = {
      ...purchaseRequests[index],
      warehouseId: body.warehouseId,
      warehouseName,
      requestedBy: body.requestedBy,
      items,
    };

    return HttpResponse.json(purchaseRequests[index]);
  }),
  http.patch('/api/purchase-requests/:id/submit', async ({ params }) => {
    await delay(500);
    const data = purchaseRequests.find((item) => item.id === params.id);
    if (!data) {
      return HttpResponse.json({ message: 'Purchase request not found' }, { status: 404 });
    }
    if (data.status !== 'DRAFT') {
      return HttpResponse.json({ message: 'Only DRAFT can be edited' }, { status: 401 });
    }

    data.status = 'SUBMITTED';
    return HttpResponse.json(data);
  }),
  http.patch('/api/purchase-requests/:id/submit', async ({ params }) => {
    await delay(500);
    const data = purchaseRequests.find((item) => item.id === params.id);
    if (!data) {
      return HttpResponse.json({ message: 'Purchase request not found' }, { status: 404 });
    }
    if (data.status !== 'DRAFT') {
      return HttpResponse.json({ message: 'Only DRAFT can be edited' }, { status: 401 });
    }

    data.status = 'SUBMITTED';
    return HttpResponse.json(data);
  }),
  http.patch('/api/purchase-requests/:id/approve', async ({ params }) => {
    await delay(500);
    const data = purchaseRequests.find((item) => item.id === params.id);
    if (!data) {
      return HttpResponse.json({ message: 'Purchase request not found' }, { status: 404 });
    }
    if (data.status !== 'SUBMITTED') {
      return HttpResponse.json({ message: 'Only DRAFT can be edited' }, { status: 401 });
    }

    data.status = 'APPROVED';
    return HttpResponse.json(data);
  }),
  http.patch('/api/purchase-requests/:id/reject', async ({ params }) => {
    await delay(500);

    const data = purchaseRequests.find((item) => item.id === params.id);

    if (!data) {
      return HttpResponse.json({ message: 'Purchase Request not found' }, { status: 404 });
    }

    if (data.status !== 'SUBMITTED') {
      return HttpResponse.json({ message: 'Only SUBMITTED request can be rejected' }, { status: 400 });
    }

    data.status = 'REJECTED';

    return HttpResponse.json(data);
  }),
];
