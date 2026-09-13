import { createFileRoute } from '@tanstack/react-router';

import { PurchaseRequestsPage } from '@/features/purchase-requests/purchase-requests-page';

export const Route = createFileRoute('/purchase-requests/')({
  component: PurchaseRequestsPage,
});
