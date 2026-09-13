import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowBigLeftDashIcon } from 'lucide-react';
import PurchaseRequestForm from './purchase-request-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPurchaseRequest } from '@/api/purchase-requests';

const CreatePurchaseRequestPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPurchaseRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });

      navigate({ to: '/purchase-requests/$id', params: { id: data.id } });
    },
  });
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link to="/purchase-requests" className="inline-flex gap-2 items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowBigLeftDashIcon className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Purchase Request</h1>
        </div>
      </div>
      <PurchaseRequestForm onSubmit={(value) => createMutation.mutate(value)} isSubmitting={createMutation.isPending} />
    </div>
  );
};

export default CreatePurchaseRequestPage;
