import type { StatusBadgeVariant } from '@/components/common/status-badge';
import type { PurchaseRequestStatus } from '@/types/purchase-request';

export const PurchaseStatus: Record<PurchaseRequestStatus, StatusBadgeVariant> = {
  DRAFT: 'neutral',
  SUBMITTED: 'info',
  APPROVED: 'success',
  REJECTED: 'danger',
};
