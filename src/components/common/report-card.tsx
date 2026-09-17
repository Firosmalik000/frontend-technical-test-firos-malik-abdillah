import type { ReportCardProps } from '@/types/report';

function ReportCard({ title, value, description, icon: Icon }: ReportCardProps) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-md bg-[#043C86]/10 p-2">
            <Icon className="size-5 text-[#043C86]" />
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
export default ReportCard;
