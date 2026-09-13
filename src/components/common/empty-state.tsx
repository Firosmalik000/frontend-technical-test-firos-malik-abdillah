import { Inbox } from 'lucide-react';

type EmptyStateProps = {
  title?: string;
  description?: string;
};

function EmptyState({ title = 'No data found', description = 'There is nothing to display yet.' }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border bg-white p-6 text-center">
      <Inbox className="mb-3 size-8 text-muted-foreground" />

      <h2 className="font-semibold">{title}</h2>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
export default EmptyState;
