import { queryOptions } from '@tanstack/react-query';

import { getPurchaseRequests } from '../../api/purchase-requests';

export const purchaseRequestQueries = {
  all: () =>
    queryOptions({
      queryKey: ['purchase-requests'],
      queryFn: getPurchaseRequests,
    }),
};
