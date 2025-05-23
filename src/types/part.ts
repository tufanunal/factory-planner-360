
export interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  qualityRate: number;
  stock: number;
  status: 'Active' | 'Low Stock' | 'Discontinued';
  description?: string;
  unit?: string;
  cycleTime?: number;
  piecesPerCycle?: number;
  consumables: {
    consumableId: string;
    amount: number;
  }[];
  rawMaterials: {
    rawMaterialId: string;
    amount: number;
  }[];
}
