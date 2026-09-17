import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { purchaseOrderQueries } from './queries';
import { ErrorState, LoadingState, StatusBadge } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { FormatDate, FormatStatus } from '@/lib/utils';

import { useState } from 'react';
import { recordGoodReceipt } from '@/api/purchase-order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PurchaseOrderStatusVariant } from './status';
import { useRole } from '@/context/role-context';

const PurchaseOrderDetailPage = () => {
  const { id } = useParams({
    from: '/purchase-orders/$id',
  });
  const [receiveQty, setReceiveQty] = useState<Record<string, number>>({});
  const [validationError, setValidationError] = useState('');
  const purchaseOrderQuery = useQuery(purchaseOrderQueries.detail(id));
  const { role } = useRole();
  const queryClient = useQueryClient();

  const receiptMutation = useMutation({
    mutationFn: (
      items: {
        productId: string;
        quantity: number;
      }[],
    ) =>
      recordGoodReceipt(id, {
        items,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['purchase-orders'],
      });

      queryClient.invalidateQueries({
        queryKey: ['purchase-orders', id],
      });
      queryClient.invalidateQueries({
        queryKey: ['inventory'],
      });

      setReceiveQty({});
      setValidationError('');
    },
  });
  if (purchaseOrderQuery.isPending) {
    return <LoadingState title="Loading purchase order..." />;
  }
  if (purchaseOrderQuery.isError) {
    return <ErrorState title="Failed to load purchase order" desc="Purchase order data could not be loaded." onRetry={() => void purchaseOrderQuery.refetch()} />;
  }

  const data = purchaseOrderQuery.data;

  return (
    <div className="space-y-6">
      <Link to="/purchase-orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{data.poNumber}</h1>

        <StatusBadge label={FormatStatus(data.status)} variant={PurchaseOrderStatusVariant[data.status]} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Purchase Order Information</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">Supplier</dt>
              <dd className="mt-1 text-sm font-medium">{data.supplier}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">Warehouse</dt>
              <dd className="mt-1 text-sm font-medium">{data.warehouseName}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">Created</dt>
              <dd className="mt-1 text-sm font-medium">{FormatDate(data.createdAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Items</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Ordered</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.items.map((item) => {
                const remaining = item.orderedQuantity - item.receivedQuantity;

                return (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">{item.productName}</TableCell>

                    <TableCell>{item.sku}</TableCell>

                    <TableCell className="text-right">{item.orderedQuantity}</TableCell>

                    <TableCell className="text-right">{item.receivedQuantity}</TableCell>

                    <TableCell className="text-right">{remaining}</TableCell>

                    <TableCell>{item.unit}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {role === 'USER' && (data.status === 'ORDERED' || data.status === 'PARTIALLY_RECEIVED') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goods Receipt</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data.items.map((item) => {
              const remaining = item.orderedQuantity - item.receivedQuantity;

              if (remaining === 0) {
                return null;
              }

              return (
                <div key={item.productId} className="grid gap-4 rounded-lg border p-4 md:grid-cols-5">
                  <div>
                    <p className="text-xs text-muted-foreground">Product</p>
                    <p className="text-sm font-medium">{item.productName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Ordered</p>
                    <p className="text-sm">{item.orderedQuantity}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Received</p>
                    <p className="text-sm">{item.receivedQuantity}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="text-sm">{remaining}</p>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Receive Now</label>

                    <Input
                      type="number"
                      min="1"
                      max={remaining}
                      value={receiveQty[item.productId] ?? ''}
                      onChange={(event) => {
                        setValidationError('');
                        receiptMutation.reset();
                        setReceiveQty({
                          ...receiveQty,
                          [item.productId]: Number(event.target.value),
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {receiptMutation.isSuccess ? (
              <p className="text-sm text-green-600">Goods receipt recorded successfully.</p>
            ) : receiptMutation.isError ? (
              <p className="text-sm text-red-600">Failed to record goods receipt.</p>
            ) : validationError ? (
              <p className="text-sm text-red-600">{validationError}</p>
            ) : null}

            <div className="flex justify-end">
              <Button
                className="w-full sm:w-auto"
                disabled={receiptMutation.isPending}

                onClick={() => {
                  receiptMutation.reset();
                  setValidationError('');
                  const items = data.items
                    .map((item) => ({
                      productId: item.productId,
                      quantity: receiveQty[item.productId] ?? 0,
                    }))
                    .filter((item) => item.quantity > 0);

                  if (items.length === 0) {
                    setValidationError('Enter at least one receive quantity.');
                    return;
                  }

                  for (const receivedItem of items) {
                    const orderItem = data.items.find((item) => item.productId === receivedItem.productId);

                    if (!orderItem) {
                      setValidationError('Product not found.');
                      return;
                    }

                    const remainingQty = orderItem.orderedQuantity - orderItem.receivedQuantity;

                    if (receivedItem.quantity > remainingQty) {
                      setValidationError(`${orderItem.productName} can only receive up to ${remainingQty} ${orderItem.unit}.`);
                      return;
                    }
                  }

                  setValidationError('');
                  receiptMutation.mutate(items);
                }}
              >
                {receiptMutation.isPending ? 'Receiving...' : 'Record Goods Receipt'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PurchaseOrderDetailPage;
