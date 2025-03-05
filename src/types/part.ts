
export interface Part {
  id: number;
  sku: string;
  name: string;
  category: string;
  qualityRate: number;
  stock: number;
  status: 'Active' | 'Low Stock' | 'Discontinued';
}
