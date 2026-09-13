import { dashboardHandlers } from './dashboard';
import { purchaseRequestHandlers } from './purchase-request';

export const handlers = [...purchaseRequestHandlers, ...dashboardHandlers];
