import { GoodsReceiptsPage } from '@/features/goods-receipt/goods-receipt-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/goods-receipts/')({
  component: GoodsReceiptsPage,
});
