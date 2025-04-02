
export interface PartRawMaterial {
  id: string;
  partId: string;
  rawMaterialId: string;
  quantity: number;
  unit: string;
  amount: number; // Adding this property since it's used in DataContext
}
