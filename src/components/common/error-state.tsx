import { CircleAlert } from 'lucide-react';
import { Button } from '../ui/button';

type ErrorProps = { title?: string; desc?: string; onRetry?: () => void };

const ErrorState = ({ title = 'Something went wrong', desc = 'We could not load the requested data', onRetry }: ErrorProps) => {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border bg-white p-6 text-center">
      <CircleAlert className="mb-3 size-8 text-red-500" />

      <h2 className="font-semibold">{title}</h2>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">{desc}</p>

      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
