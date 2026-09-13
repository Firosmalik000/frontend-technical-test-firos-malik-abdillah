import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { updatePurchaseRequest } from '@/api/purchase-requests';
import { ErrorState, LoadingState } from '@/components/common';

import PurchaseRequestForm from './purchase-request-form';
import { purchaseRequestQueries } from './queries';

export default function EditPurchaseRequestPage() {
  const { id } = useParams({
    from: '/purchase-requests/edit/$id',
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const purchaseRequestQuery = useQuery(purchaseRequestQueries.detail(id));

  const updateMutation = useMutation({
    mutationFn: (values) => updatePurchaseRequest(id, values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['purchase-requests'],
      });

      queryClient.invalidateQueries({
        queryKey: ['purchase-request', id],
      });

      navigate({
        to: '/purchase-requests/$id',
        params: { id },
      });
    },
  });

  if (purchaseRequestQuery.isLoading) {
    return <LoadingState />;
  }

  if (purchaseRequestQuery.isError) {
    return <ErrorState title="Failed to load purchase request" />;
  }

  const data = purchaseRequestQuery.data;

  if (!data) {
    return null;
  }

  if (data.status !== 'DRAFT') {
    return <ErrorState title="Purchase request cannot be edited" desc="Only DRAFT purchase requests can be edited." />;
  }

  return (
    <div className="space-y-6">
      <Link to="/purchase-requests/$id" params={{ id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">Edit Purchase Request</h1>

        <p className="text-sm text-muted-foreground">{data.requestNumber}</p>
      </div>

      <PurchaseRequestForm
        defaultValues={{
          warehouseId: data.warehouseId,
          requestedBy: data.requestedBy,
          items: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }}
        onSubmit={(values) => updateMutation.mutate(values)}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
