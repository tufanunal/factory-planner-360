
import { Machine } from '@/types/machine';
import { generateId } from '@/utils/idGenerator';

export class MachineService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getMachines(): Machine[] {
    return this.db.machines || [];
  }
  
  saveMachine(machine: Machine): Machine {
    const existingIndex = this.db.machines.findIndex((m: Machine) => m.id === machine.id);
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
    this.db.machines = this.db.machines.filter((m: Machine) => m.id !== id);
  }
}
