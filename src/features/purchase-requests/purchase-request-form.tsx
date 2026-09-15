import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseRequestFormSchema, type PurchaseRequestFormValues } from './purchase-request-form-schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
type PurchaseRequestFormProps = {
  onSubmit: (values: PurchaseRequestFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: PurchaseRequestFormValues;
};
const warehouses = [
  {
    id: 'wh-jakarta',
    name: 'Jakarta Warehouse',
  },
  {
    id: 'wh-bandung',
    name: 'Bandung Warehouse',
  },
];
const products = [
  {
    id: 'product-001',
    name: 'Industrial Oil',
    sku: 'OIL-001',
    unit: 'PCS',
  },
  {
    id: 'product-002',
    name: 'Safety Gloves',
    sku: 'SAFE-001',
    unit: 'BOX',
  },
  {
    id: 'product-003',
    name: 'Packing Tape',
    sku: 'PACK-001',
    unit: 'ROLL',
  },
];

const PurchaseRequestForm = ({ onSubmit, isSubmitting = false, defaultValues }: PurchaseRequestFormProps) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<PurchaseRequestFormValues>({
    resolver: zodResolver(purchaseRequestFormSchema),
    defaultValues: defaultValues ?? {
      warehouseId: '',
      requestedBy: 'John Doe',

      items: [
        {
          productId: '',
          quantity: 1,
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="warehouse" className="text-sm font-medium">
              Warehouse
            </label>

            <Controller
              control={control}
              name="warehouseId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="warehouse">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>

                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.warehouseId && <p className="text-sm text-red-600">{errors.warehouseId.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="requestedBy" className="text-sm font-medium">
              Requested By
            </label>

            <Input id="requestedBy" {...register('requestedBy')} readOnly className="bg-muted" />

            {errors.requestedBy && <p className="text-sm text-red-600">{errors.requestedBy.message}</p>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Requested Items</CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                productId: '',
                quantity: 1,
              })
            }
          >
            <Plus className="size-4" />
            Add Item
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-[1fr_160px_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>

                <Controller
                  control={control}
                  name={`items.${index}.productId`}
                  render={({ field: formField }) => (
                    <Select value={formField.value} onValueChange={formField.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>

                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} — {product.sku}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.items?.[index]?.productId && <p className="text-sm text-red-600">{errors.items?.[index]?.productId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>

                <Input
                  type="number"
                  min="1"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.items?.[index]?.quantity && <p className="text-sm text-red-600">{errors.items?.[index]?.quantity.message}</p>}
              </div>

              <div className="flex items-center">
                <Button type="button" variant="outline" className="bg-red-500 hover:bg-red-300" size="icon" disabled={fields.length === 1} onClick={() => remove(index)} aria-label="Remove item">
                  <Trash2 className="size-4 text-white hover:text-red-500 " />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Saving...' : 'Save Draft'}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseRequestForm;
