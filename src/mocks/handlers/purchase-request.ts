import { delay, http, HttpResponse } from 'msw';

import { db } from '../data/data';
import type { PurchaseOrder } from '@/types/purchase-order';

export const purchaseRequestHandlers = [
  http.get('/api/purchase-requests', async () => {
    await delay(500);

    return HttpResponse.json(db.purchaseRequests);
  }),
  // request by id
  http.get(`/api/purchase-requests/:id`, async ({ params }) => {
    await delay(500);

    const purchaseRequestById = db.purchaseRequests.find((item) => item.id === params.id);
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
    const id = String(db.purchaseRequests.length + 1);

    const warehouse = db.warehouses.find((item) => item.id === body.warehouseId);

    const newItem = {
      id: id,
      requestNumber: `PR-${id}`,
      warehouseId: body.warehouseId,
      warehouseName: warehouse?.name ?? '-',
      requestedBy: body.requestedBy,
      status: 'DRAFT' as const,
      createdAt: new Date().toISOString(),
      items: body.items.map((item) => {
        const product = db.products.find((prod) => prod.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name ?? '-',
          sku: product?.sku ?? '-',
          quantity: Number(item.quantity),
          unit: product?.unit ?? '-',
        };
      }),
    };

    db.purchaseRequests.push(newItem);

    return HttpResponse.json(newItem, { status: 201 });
  }),
  http.put('/api/purchase-requests/:id', async ({ params, request }) => {
    await delay(500);

    const body = (await request.json()) as { warehouseId: string; requestedBy: string; items: { productId: string; quantity: number }[] };

    const index = db.purchaseRequests.findIndex((item) => item.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Purchase Request not found' }, { status: 404 });
    }

    if (db.purchaseRequests[index].status !== 'DRAFT') {
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

    db.purchaseRequests[index] = {
      ...db.purchaseRequests[index],
      warehouseId: body.warehouseId,
      warehouseName,
      requestedBy: body.requestedBy,
      items,
    };

    return HttpResponse.json(db.purchaseRequests[index]);
  }),

  http.patch('/api/purchase-requests/:id/submit', async ({ params }) => {
    await delay(500);
    const data = db.purchaseRequests.find((item) => item.id === params.id);
    if (!data) {
      return HttpResponse.json({ message: 'Purchase request not found' }, { status: 404 });
    }
    if (data.status !== 'DRAFT') {
      return HttpResponse.json({ message: 'Only SUBMITTED request can be approved' }, { status: 400 });
    }

    data.status = 'SUBMITTED';
    return HttpResponse.json(data);
  }),
  http.patch('/api/purchase-requests/:id/approve', async ({ params }) => {
    await delay(500);
    const data = db.purchaseRequests.find((item) => item.id === params.id);
    if (!data) {
      return HttpResponse.json({ message: 'Purchase request not found' }, { status: 404 });
    }
    if (data.status !== 'SUBMITTED') {
      return HttpResponse.json({ message: 'Only SUBMITTED request  can be approved ' }, { status: 400 });
    }

    data.status = 'APPROVED';

    const existingPurchaseOrder = db.purchaseOrders.find((item) => item.purchaseRequestId === params.id);

    if (!existingPurchaseOrder) {
      const sequence = db.purchaseOrders.length + 1;

      const newOrder: PurchaseOrder = {
        id: `po-${String(sequence).padStart(3, '0')}`,
        poNumber: `PO-2026-${String(db.purchaseOrders.length + 1).padStart(3, '0')}`,
        purchaseRequestId: data.id,
        warehouseId: data.warehouseId,
        warehouseName: data.warehouseName,
        supplier: db?.suppliers[0]?.name ?? '-',
        status: 'ORDERED',
        createdAt: new Date().toISOString(),
        items: data.items.map((item) => ({
          productId: item.productId,

          productName: item.productName,

          sku: item.sku,

          orderedQuantity: item.quantity,

          receivedQuantity: 0,

          unit: item.unit,
        })),
      };
      db.purchaseOrders.push(newOrder);
    }
    return HttpResponse.json(data);
  }),
  http.patch('/api/purchase-requests/:id/reject', async ({ params, request }) => {
    await delay(500);

    const data = db.purchaseRequests.find((item) => item.id === params.id);

    if (!data) {
      return HttpResponse.json({ message: 'Purchase Request not found' }, { status: 404 });
    }

    if (data.status !== 'SUBMITTED') {
      return HttpResponse.json({ message: 'Only SUBMITTED request can be rejected' }, { status: 400 });
    }

    const body = (await request.json()) as {
      rejectionReason: string;
    };

    const rejectionReason = body.rejectionReason?.trim();

    if (!rejectionReason) return HttpResponse.json({ message: 'Reason is required for rejection' }, { status: 400 });
    data.status = 'REJECTED';
    data.rejectionReason = rejectionReason;

    return HttpResponse.json(data);
  }),
];
