import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search } from 'lucide-react';

import { inventoryQueries } from './queries';
import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('All');

  const inventoryQuery = useQuery(inventoryQueries.all());

  if (inventoryQuery.isPending) {
    return <LoadingState title="Loading inventory..." />;
  }

  if (inventoryQuery.isError) {
    return <ErrorState title="Failed to load inventory" desc="Inventory data could not be loaded." onRetry={() => void inventoryQuery.refetch()} />;
  }

  const data = inventoryQuery.data;

  if (data.length === 0) {
    return <EmptyState title="No inventory yet" description="Inventory data will appear here." />;
  }

  const filteredData = data.filter((item) => {
    const searchValue = search.toLowerCase();

    const matchSearch = item.productName.toLowerCase().includes(searchValue) || item.sku.toLowerCase().includes(searchValue);

    const matchWarehouse = warehouseFilter === 'All' || item.warehouseId === warehouseFilter;

    return matchSearch && matchWarehouse;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search inventory..." aria-label="Search inventory" className="pl-9" />
        </div>

        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
          <SelectTrigger className="w-full sm:w-52" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All warehouses</SelectItem>

            <SelectItem value="wh-jakarta">Jakarta Warehouse</SelectItem>

            <SelectItem value="wh-bandung">Bandung Warehouse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>

                    <TableCell>{item.sku}</TableCell>

                    <TableCell>{item.warehouseName}</TableCell>

                    <TableCell className="text-right">{item.currentStock}</TableCell>

                    <TableCell>{item.unit}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState title="No matching inventory" description="Try changing your search or warehouse filter." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
