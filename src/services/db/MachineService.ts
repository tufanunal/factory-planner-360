
import { Machine } from '@/types/machine';
import { generateId } from '@/utils/idGenerator';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';

export class MachineService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getMachines(): Machine[] {
    return this.db.machines || [];
  }
  
  saveMachine(machine: Machine): Machine {
    if (!this.db.machines) {
      this.db.machines = [];
    }
    
    const existingIndex = this.db.machines.findIndex((m: Machine) => m.id === machine.id);
    
    // Ensure machine has a category, defaulting to DEFAULT_CATEGORY if not specified
    if (!machine.category) {
      machine.category = DEFAULT_CATEGORY;
    }
    
    // Ensure availability is a valid percentage between 0 and 100
    if (machine.availability !== undefined) {
      machine.availability = Math.max(0, Math.min(100, machine.availability));
    }
    
    if (existingIndex >= 0) {
      this.db.machines[existingIndex] = machine;
    } else {
      if (!machine.id) {
        machine.id = generateId();
      }
      this.db.machines.push(machine);
    }
    
    return machine;
  }
  
  deleteMachine(id: string): void {
    if (this.db.machines) {
      this.db.machines = this.db.machines.filter((m: Machine) => m.id !== id);
    }
  }

  // Update machine categories if the category is changed
  updateMachineCategories(oldCategory: string, newCategory: string): void {
    if (this.db.machines && oldCategory !== newCategory) {
      this.db.machines = this.db.machines.map((m: Machine) => {
        if (m.category === oldCategory) {
          return { ...m, category: newCategory };
        }
        return m;
      });
    }
  }

  // Update machine categories when a category is deleted
  revertCategoryToDefault(categoryToDelete: string): number {
    let count = 0;
    if (this.db.machines) {
      this.db.machines = this.db.machines.map((m: Machine) => {
        if (m.category === categoryToDelete) {
          count++;
          return { ...m, category: DEFAULT_CATEGORY };
        }
        return m;
      });
    }
    return count;
  }
}
