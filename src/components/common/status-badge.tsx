import { Badge } from '../ui/badge';

export type StatusBadgeVariant = 'neutral' | 'info' | 'warning' | 'success' | 'danger';
type statusBadgeProps = {
  label: string;
  variant: StatusBadgeVariant;
};

const variantStyle: Record<StatusBadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
};

const StatusBadge = ({ label, variant = 'neutral' }: statusBadgeProps) => {
  return (
    <Badge variant={'outline'} className={variantStyle[variant]}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
