
export interface PartConsumable {
  id: string;
  partId: string;
  consumableId: string;
  quantity: number;
  unit: string;
  amount: number; // Adding this property since it's used in DataContext
}
