import { getPurchaseOrders } from '@/api/purchase-order';
import { queryOptions } from '@tanstack/react-query';

export const purchaseOrderQueries = {
  all: () =>
    queryOptions({
      queryKey: ['purchase-orders'],
      queryFn: getPurchaseOrders,
    }),
};
