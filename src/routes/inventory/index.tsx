import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/inventory/')({
  component: () => {
    return <div>Hello "/inventory/"!</div>;
  },
});
