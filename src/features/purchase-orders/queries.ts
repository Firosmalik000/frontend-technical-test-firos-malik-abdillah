import { getPurchaseOrders, getPurchaseOrdersById } from '@/api/purchase-order';
import { queryOptions } from '@tanstack/react-query';

export const purchaseOrderQueries = {
  all: () =>
    queryOptions({
      queryKey: ['purchase-orders'],
      queryFn: getPurchaseOrders,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['purchase-orders', id],
      queryFn: () => getPurchaseOrdersById(id),
    }),
};
