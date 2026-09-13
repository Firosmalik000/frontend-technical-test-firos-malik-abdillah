import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search } from 'lucide-react';

import { purchaseOrderQueries } from './queries';
import type { PurchaseOrderStatus } from '@/types/purchase-order';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { EmptyState, ErrorState, LoadingState } from '@/components/common';

import { FormatDate } from '@/lib/utils';

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | 'All'>('All');

  const purchaseOrdersQuery = useQuery(purchaseOrderQueries.all());

  if (purchaseOrdersQuery.isPending) {
    return <LoadingState title="Loading purchase orders..." />;
  }

  if (purchaseOrdersQuery.isError) {
    return <ErrorState title="Failed to load purchase orders" desc="Purchase order data could not be loaded." onRetry={() => void purchaseOrdersQuery.refetch()} />;
  }

  const data = purchaseOrdersQuery.data;
  console.log(data);

  if (data.length === 0) {
    return <EmptyState title="No purchase orders yet" description="Purchase orders will appear here." />;
  }

  const filteredData = data.filter((item) => {
    const searchValue = search.toLowerCase();

    const matchSearch = item.poNumber.toLowerCase().includes(searchValue) || item.supplier.toLowerCase().includes(searchValue) || item.warehouseName.toLowerCase().includes(searchValue);

    const matchStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search purchase orders..." className="pl-9" />
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PurchaseOrderStatus | 'All')}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ORDERED">Ordered</SelectItem>
            <SelectItem value="PARTIALLY_RECEIVED">Partially Received</SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link to="/purchase-orders/$id" params={{ id: item.id }} className="font-medium text-[#043C86] hover:underline">
                      {item.poNumber}
                    </Link>
                  </TableCell>

                  <TableCell>{item.supplier}</TableCell>

                  <TableCell>{item.warehouseName}</TableCell>

                  <TableCell>{item.items.length}</TableCell>

                  <TableCell>{item.status}</TableCell>

                  <TableCell>{FormatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
