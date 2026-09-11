import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/purchase-requests/')({
  component: () => {
    return (
      <div>
        <h1>Purchase Requests</h1>
        <p>Purchase request list page.</p>
      </div>
    );
  },
});
