import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { purchaseRequestQueries } from '../../features/purchase-requests/queries';

export const Route = createFileRoute('/purchase-requests/')({
  component: () => {
    const purchaseRequestsQuery = useQuery(purchaseRequestQueries.all());

    if (purchaseRequestsQuery.isPending) {
      return <p>Loading purchase requests...</p>;
    }

    if (purchaseRequestsQuery.isError) {
      return <p>Failed to load purchase requests.</p>;
    }

    return (
      <div>
        <h1>Purchase Requests</h1>

        {purchaseRequestsQuery.data.map((purchaseRequest) => (
          <div key={purchaseRequest.id}>
            <strong>{purchaseRequest.requestNumber}</strong>

            <p>{purchaseRequest.warehouseName}</p>

            <p>{purchaseRequest.status}</p>
          </div>
        ))}
      </div>
    );
  },
});
