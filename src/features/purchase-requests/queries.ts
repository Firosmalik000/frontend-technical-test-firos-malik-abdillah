import { queryOptions } from '@tanstack/react-query';

import { getPurchaseRequests, getPurchaseRequestById } from '../../api/purchase-requests';

export const purchaseRequestQueries = {
  all: () =>
    queryOptions({
      queryKey: ['purchase-requests'],
      queryFn: getPurchaseRequests,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['purchase-request', id],
      queryFn: () => getPurchaseRequestById(id),
    }),
};
