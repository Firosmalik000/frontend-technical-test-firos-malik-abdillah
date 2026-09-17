import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import StatusBadge from '@/components/common/status-badge';
import { getPurchaseOrders } from '@/api/purchase-order';
import { FormatStatus } from '@/lib/utils';
import { PurchaseOrderStatusVariant } from '../purchase-orders/status';

export function GoodsReceiptsPage() {
  const purchaseOrdersQuery = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: getPurchaseOrders,
  });

  if (purchaseOrdersQuery.isLoading) {
    return <LoadingState />;
  }

  if (purchaseOrdersQuery.isError) {
    return <ErrorState title="Gagal memuat Goods Receipt" desc="Data Purchase Order tidak dapat dimuat." onRetry={() => void purchaseOrdersQuery.refetch()} />;
  }

  const data = purchaseOrdersQuery.data ?? [];

  const dataFiltered = data.filter((purchaseOrder) => purchaseOrder.status === 'ORDERED' || purchaseOrder.status === 'PARTIALLY_RECEIVED');

  return (
    <div className="space-y-6">
      {dataFiltered.length === 0 ? (
        <EmptyState title="Tidak ada barang yang perlu diterima" description="Semua Purchase Order telah selesai diterima." />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium">PO Number</th>

                <th className="px-4 py-3 text-left font-medium">Warehouse</th>

                <th className="px-4 py-3 text-left font-medium">Status</th>

                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {dataFiltered.map((purchaseOrder) => (
                <tr key={purchaseOrder.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{purchaseOrder.poNumber}</td>

                  <td className="px-4 py-3">{purchaseOrder.warehouseName}</td>

                  <td className="px-4 py-3">
                    <StatusBadge label={FormatStatus(purchaseOrder.status)} variant={PurchaseOrderStatusVariant[purchaseOrder.status]} />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm">
                      <Link
                        to="/purchase-orders/$id"
                        params={{
                          id: purchaseOrder.id,
                        }}
                      >
                        Receive Goods
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
