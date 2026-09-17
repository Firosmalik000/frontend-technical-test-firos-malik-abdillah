import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { purchaseRequestQueries } from './queries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormatDate, FormatStatus } from '@/lib/utils';

import type { PurchaseRequestStatus } from '@/types/purchase-request';
import { useState } from 'react';
import { Pencil, Search, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@tanstack/react-router';
import { PurchaseStatus } from './status';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '@/components/common';
import { Button } from '@/components/ui/button';
import { submitPurchaseRequest } from '@/api/purchase-requests';
import { useRole } from '@/context/role-context';

export function PurchaseRequestsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseRequestStatus | 'All'>('All');
  //   const [idData, setIdData] = useState('');
  const purchaseRequestsQuery = useQuery(purchaseRequestQueries.all());
  const role = useRole();

  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: (id: string) => submitPurchaseRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-request'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-request', id] });
    },
  });
  if (purchaseRequestsQuery.isPending) {
    return <LoadingState title="Loading purchase requests..." />;
  }

  if (purchaseRequestsQuery.isError) {
    return <ErrorState title="Failed to load purchase requests" desc="Purchase request data could not be loaded." onRetry={() => void purchaseRequestsQuery.refetch()} />;
  }
  const datas = purchaseRequestsQuery.data;
  if (datas.length === 0) {
    return <EmptyState title="No purchase requests yet" description="Purchase requests will appear here once they are created." />;
  }
  const filterData = datas.filter((item) => {
    const searchValue = search.toLowerCase();

    const match = item.requestNumber.toLowerCase().includes(searchValue) || item.warehouseName.toLowerCase().includes(searchValue) || item.requestedBy.toLowerCase().includes(searchValue);

    const matchStatus = statusFilter == 'All' || item.status == statusFilter;

    return match && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Purchase Requests</h1>
        {role.role === 'USER' && (
          <Button asChild>
            <Link to="/purchase-requests/new">Create</Link>
          </Button>
        )}
      </div>
      {/* filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search purchase requests..." aria-label="Search purchase requests" className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PurchaseRequestStatus | 'All')}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full ">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Request Number</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterData.length > 0 ? (
                filterData?.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell className="font-medium text-[#043C86]">{index + 1}</TableCell>
                    <TableCell className="font-medium text-[#043C86]">
                      <div className="flex gap-x-2">
                        {data.status === 'DRAFT' && role.role === 'USER' ? (
                          <div className="flex gap-x-2">
                            <Button variant="outline" asChild aria-label="Edit purchase request">
                              <Link to="/purchase-requests/edit/$id" params={{ id: data.id }}>
                                <Pencil className="text-sm" />
                              </Link>
                            </Button>

                            <Button aria-label="Submit purchase request" variant="outline" onClick={() => submitMutation.mutate(data.id)} disabled={submitMutation.isPending}>
                              <Send className="text-sm text-green-500" />
                            </Button>
                          </div>
                        ) : (
                          <>-</>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[#043C86]">
                      <Link to="/purchase-requests/$id" params={{ id: data.id }} className="font-medium text-[#043C86] hover:underline">
                        {data.requestNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium text-[#043C86]">{data.warehouseName}</TableCell>
                    <TableCell className="font-medium text-[#043C86]">{data.requestedBy}</TableCell>
                    <TableCell className="font-medium text-[#043C86]">{data.items.length}</TableCell>
                    <TableCell className="font-medium text-[#043C86]">
                      <StatusBadge label={FormatStatus(data.status)} variant={PurchaseStatus[data.status]} />
                    </TableCell>
                    <TableCell className="font-medium text-[#043C86]">{FormatDate(data.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState title="No matching purchase requests" description="Try changing your search or status filter." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
