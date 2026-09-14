import type { Inventory } from '@/types/inventory';

export async function getInventories(): Promise<Inventory[]> {
  const response = await fetch('/api/inventory');

  if (!response.ok) {
    throw new Error('Failed to load inventory');
  }

  return response.json();
}

export async function getInventoriesById(id: string): Promise<Inventory[]> {
  const response = await fetch(`/api/inventory${id}`);
  if (!response.ok) {
    throw new Error('Failed to load inventory');
  }

  return response.json();
}
