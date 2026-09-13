import PurchaseRequestDetailPage from '@/features/purchase-requests/purchase-request-detail-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/purchase-requests/$id')({
  component: PurchaseRequestDetailPage,
});
