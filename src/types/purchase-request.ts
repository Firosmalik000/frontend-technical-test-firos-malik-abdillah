export type PurchaseRequestStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export type PurchaseRequestItem = {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
};

export type PurchaseRequest = {
  id: string;
  requestNumber: string;
  warehouseId: string;
  warehouseName: string;
  requestedBy: string;
  status: PurchaseRequestStatus;
  items: PurchaseRequestItem[];
  createdAt: string;
};
