import { getInventories } from '@/api/inventory';
import { getPurchaseOrders } from '@/api/purchase-order';
import { getPurchaseRequests } from '@/api/purchase-requests';
import { ErrorState, LoadingState } from '@/components/common';
import ReportCard from '@/components/common/report-card';
import StatusRow from '@/components/common/status-row';
import { useQuery } from '@tanstack/react-query';
import { Boxes, ClipboardCheck, ClipboardList, PackageCheck } from 'lucide-react';

const ReportPage = () => {
  const purchaseRequest = useQuery({
    queryKey: ['purchase-requests'],
    queryFn: getPurchaseRequests,
  });
  const purchaseOrder = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: getPurchaseOrders,
  });
  const inventory = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: getInventories,
  });

  const isLoading = inventory.isLoading || purchaseOrder.isLoading || purchaseRequest.isLoading;
  const isError = inventory.isError || purchaseOrder.isError || purchaseRequest.isError;

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Gagal memuat laporan"
        desc="Data laporan tidak dapat dimuat."
        onRetry={() => {
          void inventory.refetch();
          void purchaseOrder.refetch();
          void purchaseRequest.refetch();
        }}
      />
    );
  }
  const dataRequest = purchaseRequest.data ?? [];
  const dataOrder = purchaseOrder.data ?? [];
  const dataInventory = inventory.data ?? [];

  const approvedRequest = dataRequest.filter((item) => item.status === 'APPROVED');

  const submittedRequest = dataRequest.filter((item) => item.status === 'SUBMITTED');

  const receivableOrder = dataOrder.filter((item) => item.status === 'PARTIALLY_RECEIVED' || item.status === 'ORDERED');

  const receivedOrder = dataOrder.filter((item) => item.status === 'RECEIVED');
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard title="Purchase Requests" value={dataRequest.length} description={`${submittedRequest.length} menunggu approval`} icon={ClipboardList} />

        <ReportCard title="Approved Requests" value={approvedRequest.length} description="Purchase Request disetujui" icon={ClipboardCheck} />

        <ReportCard title="Open Receipts" value={receivableOrder.length} description="PO masih menunggu penerimaan" icon={PackageCheck} />

        <ReportCard title="Inventory Items" value={dataInventory.length} description="Produk terdaftar di inventory" icon={Boxes} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReportSection title="Purchase Request Status">
          <StatusRow label="Draft" value={dataRequest.filter((request) => request.status === 'DRAFT').length} />

          <StatusRow label="Submitted" value={submittedRequest.length} />

          <StatusRow label="Approved" value={approvedRequest.length} />

          <StatusRow label="Rejected" value={dataRequest.filter((request) => request.status === 'REJECTED').length} />
        </ReportSection>

        <ReportSection title="Purchase Order Status">
          <StatusRow label="Draft" value={dataOrder.filter((order) => order.status === 'DRAFT').length} />

          <StatusRow label="Ordered" value={dataOrder.filter((order) => order.status === 'ORDERED').length} />

          <StatusRow label="Partially Received" value={dataOrder.filter((order) => order.status === 'PARTIALLY_RECEIVED').length} />

          <StatusRow label="Received" value={receivedOrder.length} />

          <StatusRow label="Cancelled" value={dataOrder.filter((order) => order.status === 'CANCELLED').length} />
        </ReportSection>
      </div>
    </div>
  );
};

export default ReportPage;

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">{title}</h2>
      </div>

      <div className="divide-y px-5">{children}</div>
    </div>
  );
}
