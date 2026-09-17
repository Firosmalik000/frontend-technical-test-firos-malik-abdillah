import ReportPage from '@/features/reports/report-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reports/')({
  component: ReportPage,
});
