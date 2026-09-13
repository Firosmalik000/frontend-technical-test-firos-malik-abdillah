import { useQuery } from '@tanstack/react-query';
import { dashboardQueries } from './queries';
import { ClipboardList, Clock3, PackageSearch, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState, LoadingState } from '@/components/common';

export function DashboardPage() {
  const dashboardQuery = useQuery(dashboardQueries.summary());
  if (dashboardQuery.isPending) {
    return <LoadingState title="Loading Dashboard..." />;
  }

  if (dashboardQuery.isError) {
    return <ErrorState title="Failed to load Dashboard" desc="Dashboard data could not be loaded." onRetry={() => void dashboardQuery.refetch()} />;
  }

  const summary = dashboardQuery.data;
  const overviewItems = [
    {
      title: 'Total Purchase Requests',
      value: summary.totalPurchaseRequests,
      icon: ClipboardList,
    },
    {
      title: 'Pending Approvals',
      value: summary.pendingApprovals,
      icon: Clock3,
    },
    {
      title: 'Open Purchase Orders',
      value: summary.openPurchaseOrders,
      icon: ShoppingCart,
    },
    {
      title: 'Low Stock Items',
      value: summary.lowStockItems,
      icon: PackageSearch,
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-sm text-muted-foreground">Overview of procurement and inventory activity.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Procurement Overview</h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                  <div className="flex size-9 items-center justify-center rounded-md bg-[#043C86]/10">
                    <Icon className="size-4 text-[#043C86]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
