
export interface Consumable {
  id: string;
  name: string;
  unit: string;
  stock: number;
  costPerUnit: number;
  description?: string;
  unitCost?: number;
}
