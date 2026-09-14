import { dashboardHandlers } from './dashboard';
import { purchaseOrderHandler } from './purchase-order';
import { purchaseRequestHandlers } from './purchase-request';
import { inventoryHandlers } from './inventory';
export const handlers = [...purchaseRequestHandlers, ...dashboardHandlers, ...purchaseOrderHandler, ...inventoryHandlers];
