import { queryOptions } from '@tanstack/react-query';
import { getInventories, getInventoriesById } from '@/api/inventory';

export const inventoryQueries = {
  all: () =>
    queryOptions({
      queryKey: ['inventory'],
      queryFn: getInventories,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['inventory', id],
      queryFn: () => getInventoriesById(id),
    }),
};
