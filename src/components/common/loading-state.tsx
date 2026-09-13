import { Skeleton } from '../ui/skeleton';

type loadingProps = { title?: string };
const LoadingState = ({ title = 'Loading...' }: loadingProps) => {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{title}</p>
      <div className="space-y-3 rounded-lg border bg-white p-4">
        <Skeleton className="h-5 w-1/3 shadow-2xl"></Skeleton>
        <Skeleton className="h-10 w-full shadow-2xl" />
        <Skeleton className="h-10 w-full shadow-2xl" />
      </div>
    </div>
  );
};

export default LoadingState;
