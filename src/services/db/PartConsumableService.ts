
import { PartConsumable } from '@/types/partConsumable';
import { generateId } from '@/utils/idGenerator';

export class PartConsumableService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getPartConsumables(): PartConsumable[] {
    return this.db.partConsumables || [];
  }
  
  savePartConsumable(partConsumable: PartConsumable): PartConsumable {
    const existingIndex = this.db.partConsumables.findIndex(
      (pc: PartConsumable) => pc.partId === partConsumable.partId && pc.consumableId === partConsumable.consumableId
    );
    
    if (existingIndex >= 0) {
      this.db.partConsumables[existingIndex] = partConsumable;
    } else {
      if (!partConsumable.id) {
        partConsumable.id = generateId();
      }
      this.db.partConsumables.push(partConsumable);
    }
    
    return partConsumable;
  }
  
  deletePartConsumable(partId: string, consumableId: string): void {
    this.db.partConsumables = this.db.partConsumables.filter(
      (pc: PartConsumable) => !(pc.partId === partId && pc.consumableId === consumableId)
    );
  }
}
