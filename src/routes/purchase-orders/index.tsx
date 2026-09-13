import PurchaseOrdersPage from '@/features/purchase-orders/purchase-orders-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/purchase-orders/')({
  component: PurchaseOrdersPage,
});
