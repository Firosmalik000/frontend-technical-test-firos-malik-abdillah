import type { StatusBadgeVariant } from '@/components/common/status-badge';
import type { PurchaseOrderStatus } from '@/types/purchase-order';

export const PurchaseOrderStatusVariant: Record<PurchaseOrderStatus, StatusBadgeVariant> = {
  DRAFT: 'neutral',
  ORDERED: 'info',
  PARTIALLY_RECEIVED: 'warning',
  RECEIVED: 'success',
  CANCELLED: 'danger',
};
