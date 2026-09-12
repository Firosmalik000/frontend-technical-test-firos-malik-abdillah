import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: () => {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
    );
  },
});
