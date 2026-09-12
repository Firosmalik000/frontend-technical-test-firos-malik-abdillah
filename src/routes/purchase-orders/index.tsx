import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/purchase-orders/')({
  component: () => {
    return <div className="font-bold">Hello "/purchase-orders/"!</div>;
  },
});
