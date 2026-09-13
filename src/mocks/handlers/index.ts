import { dashboardHandlers } from './dashboard';
import { purchaseOrderHandler } from './purchase-order';
import { purchaseRequestHandlers } from './purchase-request';

export const handlers = [...purchaseRequestHandlers, ...dashboardHandlers, ...purchaseOrderHandler];
