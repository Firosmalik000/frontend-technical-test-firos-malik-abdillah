import PurchaseOrderDetailPage from '@/features/purchase-orders/purchase-orders-detail-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/purchase-orders/$id')({
  component: PurchaseOrderDetailPage,
});
