import type { DashboardSummary } from '@/types/dashboard';

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch('/api/dashboard/summary');
  if (!response.ok) {
    throw new Error('Failed to load dashboard summary');
  }
  return response.json();
}
