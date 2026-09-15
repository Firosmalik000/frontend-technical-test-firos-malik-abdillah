import { queryOptions } from '@tanstack/react-query';
import { getInventories, getInventoriyById } from '@/api/inventory';

export const inventoryQueries = {
  all: () =>
    queryOptions({
      queryKey: ['inventory'],
      queryFn: getInventories,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['inventory', id],
      queryFn: () => getInventoriyById(id),
    }),
};
