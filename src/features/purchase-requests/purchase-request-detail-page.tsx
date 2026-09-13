import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { purchaseRequestQueries } from './queries';
import { ArrowLeft } from 'lucide-react';
import { PurchaseStatus } from './status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormatDate } from '@/lib/utils';
import { ErrorState, LoadingState, StatusBadge } from '@/components/common';
import { Button } from '@/components/ui/button';
import { getCurrentRole } from '@/lib/role';
import { approvePurchaseRequest, rejectPurchaseRequest, submitPurchaseRequest } from '@/api/purchase-requests';

const PurchaseRequestDetailPage = () => {
  const { id } = useParams({
    from: '/purchase-requests/$id',
  });
  const role = getCurrentRole();
  const queryClient = useQueryClient();

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
    queryClient.invalidateQueries({ queryKey: ['purchase-requests', id] });
  };
  const submitMutation = useMutation({
    mutationFn: () => submitPurchaseRequest(id),
    onSuccess: refreshData,
  });

  const approveMutation = useMutation({
    mutationFn: () => approvePurchaseRequest(id),
    onSuccess: refreshData,
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectPurchaseRequest(id),
    onSuccess: refreshData,
  });

  const purchaseRequestsQuery = useQuery(purchaseRequestQueries.detail(id));
  if (purchaseRequestsQuery.isPending) {
    return <LoadingState title="Loading purchase requests..." />;
  }

  if (purchaseRequestsQuery.isError) {
    return <ErrorState title="Failed to load purchase requests" desc="Purchase request data could not be loaded." onRetry={() => void purchaseRequestsQuery.refetch()} />;
  }
  const data = purchaseRequestsQuery.data;
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <Link to="/purchase-requests" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back
          </Link>
          {/* {data.status === 'DRAFT' && (
            <Button asChild>
              <Link to="/purchase-requests/edit/$id" params={{ id: data.id }}>
                Edit
              </Link>
            </Button>
          )} */}
          <div className="flex gap-2">
            {role === 'USER' && data.status === 'DRAFT' && (
              <>
                <Button variant="outline" asChild>
                  <Link to="/purchase-requests/edit/$id" params={{ id: data.id }}>
                    Edit
                  </Link>
                </Button>

                <Button
                  onClick={() => {
                    if (window.confirm('Submit this purchase request?')) {
                      submitMutation.mutate();
                    }
                  }}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit'}
                </Button>
              </>
            )}

            {role === 'APPROVER' && data.status === 'SUBMITTED' && (
              <>
                <Button
                  onClick={() => {
                    if (window.confirm('Approve this purchase request?')) {
                      approveMutation.mutate();
                    }
                  }}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  {approveMutation.isPending ? 'Approving...' : 'Approve'}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm('Reject this purchase request?')) {
                      rejectMutation.mutate();
                    }
                  }}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{data.requestNumber}</h1>

              <StatusBadge label={data.status} variant={PurchaseStatus[data.status]} />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request Information</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Warehouse</dt>

              <dd className="mt-1 text-sm font-medium">{data.warehouseName}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Requested By</dt>

              <dd className="mt-1 text-sm font-medium">{data.requestedBy}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Created</dt>

              <dd className="mt-1 text-sm font-medium">{FormatDate(data.createdAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Requested Items</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.productName}</TableCell>

                  <TableCell className="text-muted-foreground">{item.sku}</TableCell>

                  <TableCell className="text-right">{item.quantity}</TableCell>

                  <TableCell>{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseRequestDetailPage;
