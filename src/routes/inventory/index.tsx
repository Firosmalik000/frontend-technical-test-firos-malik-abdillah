import InventoryPage from '@/features/inventory/inventory-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/inventory/')({
  component: InventoryPage,
});
