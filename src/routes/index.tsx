import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => {
    <div>
      <h1>ProcureFlow</h1>
      <p>Inventory Procurement Application</p>
    </div>;
  },
});
