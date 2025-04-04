
import { Unit } from '@/types/unit';
import { generateId } from '@/utils/idGenerator';

export class UnitService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getUnits(): Unit[] {
    return this.db.units || [];
  }
  
  saveUnit(unit: Unit): Unit {
    const existingIndex = this.db.units.findIndex((u: Unit) => u.id === unit.id);
    if (existingIndex >= 0) {
      this.db.units[existingIndex] = unit;
    } else {
      if (!unit.id) {
        unit.id = generateId();
      }
      this.db.units.push(unit);
    }
    
    return unit;
  }
  
  deleteUnit(id: string): void {
    this.db.units = this.db.units.filter((u: Unit) => u.id !== id);
  }
}
