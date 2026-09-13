import EditPurchaseRequestPage from '@/features/purchase-requests/edit-purchase-request-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/purchase-requests/edit/$id')({
  component: EditPurchaseRequestPage,
});
