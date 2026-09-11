import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/purchase-orders/')({
  component: () => {
    return <div>Hello "/purchase-orders/"!</div>;
  },
});
