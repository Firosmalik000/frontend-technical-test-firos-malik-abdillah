import { delay, http, HttpResponse } from 'msw';
import { dashboardSummary } from '../data/dashboard';

export const dashboardHandlers = [
  http.get('api/dashboard/summary', async () => {
    await delay(500);

    return HttpResponse.json(dashboardSummary);
  }),
];
