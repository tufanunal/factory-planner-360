
import { Consumable } from '@/types/consumable';
import { generateId } from '@/utils/idGenerator';

export class ConsumableService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getConsumables(): Consumable[] {
    return this.db.consumables || [];
  }
  
  saveConsumable(consumable: Consumable): Consumable {
    const existingIndex = this.db.consumables.findIndex((c: Consumable) => c.id === consumable.id);
    if (existingIndex >= 0) {
      this.db.consumables[existingIndex] = consumable;
    } else {
      if (!consumable.id) {
        consumable.id = generateId();
      }
      this.db.consumables.push(consumable);
    }
    
    return consumable;
  }
  
  deleteConsumable(id: string): void {
    this.db.consumables = this.db.consumables.filter((c: Consumable) => c.id !== id);
  }
}
