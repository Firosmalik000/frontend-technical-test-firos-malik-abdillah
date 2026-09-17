import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Download } from 'lucide-react';

import { getPurchaseRequests } from '@/api/purchase-requests';
import { getPurchaseOrders } from '@/api/purchase-order';
import { getInventories } from '@/api/inventory';

import { EmptyState, ErrorState, LoadingState } from '@/components/common';

import StatusBadge from '@/components/common/status-badge';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormatStatus } from '@/lib/utils';
import { PurchaseStatus } from '../purchase-requests/status';
import ReportCard from '@/components/common/report-card';

export function DashboardPage() {
  const purchaseRequestsQuery = useQuery({
    queryKey: ['purchase-requests'],
    queryFn: getPurchaseRequests,
  });

  const purchaseOrdersQuery = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: getPurchaseOrders,
  });

  const inventoryQuery = useQuery({
    queryKey: ['inventory'],
    queryFn: getInventories,
  });

  const isLoading = purchaseRequestsQuery.isLoading || purchaseOrdersQuery.isLoading || inventoryQuery.isLoading;

  const isError = purchaseRequestsQuery.isError || purchaseOrdersQuery.isError || inventoryQuery.isError;

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState title="Gagal memuat dashboard" desc="Data procurement tidak dapat dimuat." />;
  }

  const purchaseRequests = purchaseRequestsQuery.data ?? [];

  const purchaseOrders = purchaseOrdersQuery.data ?? [];

  const inventories = inventoryQuery.data ?? [];

  const totalPurchaseRequests = purchaseRequests.length;

  const waitingForApproval = purchaseRequests.filter((request) => request.status === 'SUBMITTED').length;

  const activePurchaseOrders = purchaseOrders.filter((order) => order.status === 'ORDERED' || order.status === 'PARTIALLY_RECEIVED').length;

  const partiallyReceivedOrders = purchaseOrders.filter((order) => order.status === 'PARTIALLY_RECEIVED').length;

  const recentPurchaseRequests = purchaseRequests.slice(0, 4);

  const requestActivities = purchaseRequests.slice(0, 2).map((request) => ({
    id: `pr-${request.id}`,
    title: `${request.id} ${FormatStatus(request.status).toLowerCase()}`,
    description: getRequestActivityDescription(request.status),
  }));

  const orderActivities = purchaseOrders.slice(0, 2).map((order) => ({
    id: `po-${order.id}`,
    title: `${order.id} ${FormatStatus(order.status).toLowerCase()}`,
    description: getOrderActivityDescription(order.status),
  }));

  const recentActivities = [...requestActivities, ...orderActivities].slice(0, 4);

  const handleExport = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Purchase Requests', totalPurchaseRequests],
      ['Waiting for Approval', waitingForApproval],
      ['Active Purchase Orders', activePurchaseOrders],
      ['Partially Received Orders', partiallyReceivedOrders],
      ['Inventory Items', inventories.length],
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = 'procurement-overview.csv';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* PAGE HEADER */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-foreground">Dashboard</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Procurement System</span>

          <div className="rounded-md border bg-white px-3 py-1.5 text-foreground">Manager</div>
        </div>
      </div>

      {/* TITLE + ACTION*/}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Procurement Overview</h1>

          <p className="mt-1 text-sm text-muted-foreground">Track purchase requests, orders, receiving progress, and procurement activity.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleExport}>
            <Download className="size-4" />
            Export
          </Button>

          <Button asChild size="sm" className="bg-[#043C86] hover:bg-[#043679]">
            <Link to="/purchase-requests/new">+ Create Purchase Request</Link>
          </Button>
        </div>
      </div>

      {/* =================================
          ATTENTION CARD
      ================================= */}

      <div className="flex flex-col gap-4 rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{waitingForApproval} purchase requests need your attention.</p>

          <p className="mt-1 text-xs text-muted-foreground">Review pending requests before they delay downstream purchasing.</p>
        </div>

        <Button asChild size="sm" className="shrink-0 bg-[#043C86] hover:bg-[#043679]">
          <Link to="/purchase-requests">
            Review requests
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* =================================
          METRICS
      ================================= */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard title="Total Purchase Requests" value={totalPurchaseRequests} description="All purchase requests" />

        <ReportCard title="Waiting for Approval" value={waitingForApproval} description="Requires manager action" />

        <ReportCard title="Active Purchase Orders" value={activePurchaseOrders} description="Orders currently active" />

        <ReportCard title="Partially Received Orders" value={partiallyReceivedOrders} description="Receiving still in progress" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        {/* RECENT PURCHASE REQUESTS */}

        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Purchase Requests</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">Latest procurement requests.</p>
            </div>

            <Button asChild size="sm" variant="outline">
              <Link to="/purchase-requests">View all</Link>
            </Button>
          </div>

          {recentPurchaseRequests.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Belum ada Purchase Request" description="Purchase Request terbaru akan tampil di sini." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>

                    <TableHead>Requested By</TableHead>

                    <TableHead>Warehouse</TableHead>

                    <TableHead>Items</TableHead>

                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentPurchaseRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>

                      <TableCell>{request.warehouseName}</TableCell>

                      <TableCell>{request.requestedBy}</TableCell>

                      <TableCell>{request.items?.length ?? 0}</TableCell>

                      <TableCell>
                        <StatusBadge label={FormatStatus(request.status)} variant={PurchaseStatus[request.status]} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* =================================
            RECENT ACTIVITY
        ================================= */}

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>

            <p className="mt-0.5 text-xs text-muted-foreground">Latest procurement activity.</p>
          </div>

          {recentActivities.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Belum ada aktivitas" description="Aktivitas procurement akan tampil di sini." />
            </div>
          ) : (
            <div className="divide-y">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3 px-4 py-4">
                  <div className="mt-1 size-2 shrink-0 rounded-full bg-[#043C86]" />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getRequestActivityDescription(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'Purchase request has been approved.';

    case 'SUBMITTED':
      return 'Purchase request is waiting for approval.';

    case 'REJECTED':
      return 'Purchase request has been rejected.';

    case 'DRAFT':
      return 'Purchase request is still in draft.';

    default:
      return 'Purchase request status updated.';
  }
}

function getOrderActivityDescription(status: string) {
  switch (status) {
    case 'ORDERED':
      return 'Purchase order has been ordered.';

    case 'PARTIALLY_RECEIVED':
      return 'Some ordered goods have been received.';

    case 'RECEIVED':
      return 'All ordered goods have been received.';

    case 'CANCELLED':
      return 'Purchase order has been cancelled.';

    default:
      return 'Purchase order status updated.';
  }
}
