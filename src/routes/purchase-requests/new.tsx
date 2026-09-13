import CreatePurchaseRequestPage from '@/features/purchase-requests/create-purchase-request-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/purchase-requests/new')({
  component: CreatePurchaseRequestPage,
});
