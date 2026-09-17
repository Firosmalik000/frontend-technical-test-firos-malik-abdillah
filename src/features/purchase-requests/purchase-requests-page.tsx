import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Check, Pencil, Search, Send, X } from 'lucide-react';
import { useState } from 'react';

import { approvePurchaseRequest, rejectPurchaseRequest, submitPurchaseRequest } from '@/api/purchase-requests';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRole } from '@/context/role-context';
import { FormatDate, FormatStatus } from '@/lib/utils';
import type { PurchaseRequestStatus } from '@/types/purchase-request';

import { purchaseRequestQueries } from './queries';
import { PurchaseStatus } from './status';

export function PurchaseRequestsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseRequestStatus | 'All'>('All');

  const { role } = useRole();

  const queryClient = useQueryClient();

  const purchaseRequestsQuery = useQuery(purchaseRequestQueries.all());

  /*
   * SUBMIT
   * DRAFT -> SUBMITTED
   */
  const submitMutation = useMutation({
    mutationFn: submitPurchaseRequest,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: purchaseRequestQueries.all().queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ['purchase-request', id],
      });
    },

    onError: () => {
      window.alert('Failed to submit purchase request.');
    },
  });

  const approveMutation = useMutation({
    mutationFn: approvePurchaseRequest,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: purchaseRequestQueries.all().queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ['purchase-request', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['purchase-orders'],
      });
    },

    onError: () => {
      window.alert('Failed to approve purchase request.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectPurchaseRequest(id, reason),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: purchaseRequestQueries.all().queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ['purchase-request', variables.id],
      });
    },

    onError: () => {
      window.alert('Failed to reject purchase request.');
    },
  });

  const handleReject = (id: string) => {
    const reason = window.prompt('Enter rejection reason:');

    if (reason === null) {
      return;
    }

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      window.alert('Rejection reason is required.');

      return;
    }

    rejectMutation.mutate({
      id,
      reason: trimmedReason,
    });
  };

  if (purchaseRequestsQuery.isPending) {
    return <LoadingState title="Loading purchase requests..." />;
  }

  if (purchaseRequestsQuery.isError) {
    return <ErrorState title="Failed to load purchase requests" desc="Purchase request data could not be loaded." onRetry={() => void purchaseRequestsQuery.refetch()} />;
  }

  const datas = purchaseRequestsQuery.data;

  const filterData = datas.filter((item) => {
    const searchValue = search.trim().toLowerCase();

    const match = item.requestNumber.toLowerCase().includes(searchValue) || item.warehouseName.toLowerCase().includes(searchValue) || item.requestedBy.toLowerCase().includes(searchValue);

    const matchStatus = statusFilter === 'All' || item.status === statusFilter;

    return match && matchStatus;
  });

  const isActionPending = submitMutation.isPending || approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="space-y-5">
      {/* Create */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        {role === 'USER' && (
          <Button asChild>
            <Link to="/purchase-requests/new">Create</Link>
          </Button>
        )}
      </div>

      {/* Filter */}
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

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table className="w-full">
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
                filterData.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell>{index + 1}</TableCell>

                    {/* ACTION */}
                    <TableCell>
                      {/* USER + DRAFT */}
                      {data.status === 'DRAFT' && role === 'USER' ? (
                        <div className="flex items-center gap-2">
                          {/* Edit */}
                          <Button variant="outline" size="icon" asChild>
                            <Link
                              to="/purchase-requests/edit/$id"
                              params={{
                                id: data.id,
                              }}
                              aria-label="Edit purchase request"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          </Button>

                          {/* Submit */}
                          <Button variant="outline" size="icon" aria-label="Submit purchase request" disabled={isActionPending} onClick={() => submitMutation.mutate(data.id)}>
                            <Send className="size-4 text-green-600" />
                          </Button>
                        </div>
                      ) : data.status === 'SUBMITTED' && role === 'APPROVER' ? (
                        <div className="flex items-center gap-2">
                          {/* Approve */}
                          <Button variant="outline" size="icon" aria-label="Approve purchase request" disabled={isActionPending} onClick={() => approveMutation.mutate(data.id)}>
                            <Check className="size-4 text-green-600" />
                          </Button>

                          {/* Reject */}
                          <Button variant="outline" size="icon" aria-label="Reject purchase request" disabled={isActionPending} onClick={() => handleReject(data.id)}>
                            <X className="size-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Request Number */}
                    <TableCell>
                      <Link
                        to="/purchase-requests/$id"
                        params={{
                          id: data.id,
                        }}
                        className="font-medium text-primary hover:underline"
                      >
                        {data.requestNumber}
                      </Link>
                    </TableCell>

                    <TableCell>{data.warehouseName}</TableCell>

                    <TableCell>{data.requestedBy}</TableCell>

                    <TableCell>{data.items.length}</TableCell>

                    <TableCell>
                      <StatusBadge label={FormatStatus(data.status)} variant={PurchaseStatus[data.status]} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground">{FormatDate(data.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
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
