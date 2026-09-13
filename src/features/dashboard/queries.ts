import { getDashboardSummary } from '@/api/dashboard';
import { queryOptions } from '@tanstack/react-query';

export const dashboardQueries = {
  summary: () =>
    queryOptions({
      queryKey: ['dashboard', 'summary'],
      queryFn: getDashboardSummary,
    }),
};
