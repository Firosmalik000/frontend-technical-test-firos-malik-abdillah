import { useQuery } from '@tanstack/react-query';

import { purchaseRequestQueries } from '../../features/purchase-requests/queries';

export function PurchaseRequestsPage() {
  const purchaseRequests = useQuery(purchaseRequestQueries.all());

  if (purchaseRequests.isPending) {
    return <p>Loading purchase requests...</p>;
  }

  if (purchaseRequests.isError) {
    return <p>Failed to load purchase requests.</p>;
  }

  return (
    <div>
      <h1>Purchase Requests</h1>

      {purchaseRequests.data.map((purchaseRequest) => (
        <div key={purchaseRequest.id}>
          <strong>{purchaseRequest.requestNumber}</strong>
          <p>{purchaseRequest.warehouseName}</p>
          <p>{purchaseRequest.status}</p>
        </div>
      ))}
    </div>
  );
}
