
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { 
  Machine, 
  Part, 
  Consumable, 
  RawMaterial, 
  PartConsumable, 
  PartRawMaterial,
  CalendarState,
  Unit
} from '@/types/all';

interface FactoryDB extends DBSchema {
  machines: {
    key: string;
    value: Machine;
  };
  parts: {
    key: string;
    value: Part;
  };
  consumables: {
    key: string;
    value: Consumable;
  };
  rawMaterials: {
    key: string;
    value: RawMaterial;
  };
  partConsumables: {
    key: string;
    value: PartConsumable;
  };
  partRawMaterials: {
    key: string;
    value: PartRawMaterial;
  };
  calendar: {
    key: string;
    value: CalendarState;
  };
  units: {
    key: string;
    value: Unit;
  };
}

class DatabaseService {
  private db: IDBPDatabase<FactoryDB> | null = null;
  private initialized = false;
  
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const db = await openDB<FactoryDB>('factory-planner', 1, {
        upgrade(db, oldVersion, newVersion) {
          if (oldVersion < 1) {
            // Create object stores if they don't exist
            if (!db.objectStoreNames.contains('machines')) {
              db.createObjectStore('machines', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('parts')) {
              db.createObjectStore('parts', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('consumables')) {
              db.createObjectStore('consumables', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('rawMaterials')) {
              db.createObjectStore('rawMaterials', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('partConsumables')) {
              db.createObjectStore('partConsumables', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('partRawMaterials')) {
              db.createObjectStore('partRawMaterials', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('calendar')) {
              db.createObjectStore('calendar', { keyPath: 'viewDate' });
            }
            if (!db.objectStoreNames.contains('units')) {
              db.createObjectStore('units', { keyPath: 'id' });
            }
          }
        },
      });
      
      this.db = db;
      this.initialized = true;
      console.info('Database initialized successfully');

      // Try to migrate data from localStorage, if exists
      await this.migrateFromLocalStorage();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async migrateFromLocalStorage(): Promise<void> {
    try {
      const migrationCompleted = localStorage.getItem('migration-completed');
      if (migrationCompleted === 'true') {
        console.info('Migration already completed, skipping');
        return;
      }

      // Migrate machines
      const storedMachines = localStorage.getItem('machines');
      if (storedMachines) {
        const machines = JSON.parse(storedMachines);
        for (const machine of machines) {
          // Ensure id is a string before saving
          if (typeof machine.id === 'number') {
            machine.id = String(machine.id);
          }
          await this.saveMachine(machine);
        }
      }

      // Migrate parts
      const storedParts = localStorage.getItem('parts');
      if (storedParts) {
        const parts = JSON.parse(storedParts);
        for (const part of parts) {
          // Ensure id is a string before saving
          if (typeof part.id === 'number') {
            part.id = String(part.id);
          }
          await this.savePart(part);
        }
      }

      // Migrate consumables
      const storedConsumables = localStorage.getItem('consumables');
      if (storedConsumables) {
        const consumables = JSON.parse(storedConsumables);
        for (const consumable of consumables) {
          // Ensure id is a string before saving
          if (typeof consumable.id === 'number') {
            consumable.id = String(consumable.id);
          }
          await this.saveConsumable(consumable);
        }
      }

      // Migrate raw materials
      const storedRawMaterials = localStorage.getItem('rawMaterials');
      if (storedRawMaterials) {
        const rawMaterials = JSON.parse(storedRawMaterials);
        for (const rawMaterial of rawMaterials) {
          // Ensure id is a string before saving
          if (typeof rawMaterial.id === 'number') {
            rawMaterial.id = String(rawMaterial.id);
          }
          await this.saveRawMaterial(rawMaterial);
        }
      }

      localStorage.setItem('migration-completed', 'true');
      console.info('Migration from localStorage completed successfully');
    } catch (error) {
      console.error('Failed to migrate from localStorage:', error);
    }
  }

  // Units methods
  async getUnits(): Promise<Unit[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('units');
  }

  async saveUnit(unit: Unit): Promise<Unit> {
    if (!this.db) await this.initialize();
    await this.db!.put('units', unit);
    return unit;
  }

  async deleteUnit(id: string): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.delete('units', id);
  }

  // Machine methods
  async getMachines(): Promise<Machine[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('machines');
  }

  async saveMachine(machine: Machine): Promise<Machine> {
    if (!this.db) await this.initialize();
    // Ensure id is a string
    if (typeof machine.id === 'number') {
      machine = { ...machine, id: String(machine.id) };
    }
    await this.db!.put('machines', machine);
    return machine;
  }

  async deleteMachine(id: string): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.delete('machines', id);
  }

  // Part methods
  async getParts(): Promise<Part[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('parts');
  }

  async savePart(part: Part): Promise<Part> {
    if (!this.db) await this.initialize();
    // Ensure id is a string
    if (typeof part.id === 'number') {
      part = { ...part, id: String(part.id) };
    }
    await this.db!.put('parts', part);
    return part;
  }

  async deletePart(id: string): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.delete('parts', id);
  }

  // Consumable methods
  async getConsumables(): Promise<Consumable[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('consumables');
  }

  async saveConsumable(consumable: Consumable): Promise<Consumable> {
    if (!this.db) await this.initialize();
    // Ensure id is a string
    if (typeof consumable.id === 'number') {
      consumable = { ...consumable, id: String(consumable.id) };
    }
    await this.db!.put('consumables', consumable);
    return consumable;
  }

  async deleteConsumable(id: string): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.delete('consumables', id);
  }

  // Raw Material methods
  async getRawMaterials(): Promise<RawMaterial[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('rawMaterials');
  }

  async saveRawMaterial(material: RawMaterial): Promise<RawMaterial> {
    if (!this.db) await this.initialize();
    // Ensure id is a string
    if (typeof material.id === 'number') {
      material = { ...material, id: String(material.id) };
    }
    await this.db!.put('rawMaterials', material);
    return material;
  }

  async deleteRawMaterial(id: string): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.delete('rawMaterials', id);
  }

  // Part Relationships methods
  async getPartConsumables(): Promise<PartConsumable[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('partConsumables');
  }

  async savePartConsumable(item: PartConsumable): Promise<PartConsumable> {
    if (!this.db) await this.initialize();
    await this.db!.put('partConsumables', item);
    return item;
  }

  async deletePartConsumable(id: string): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.delete('partConsumables', id);
  }

  async getPartRawMaterials(): Promise<PartRawMaterial[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('partRawMaterials');
  }

  async savePartRawMaterial(item: PartRawMaterial): Promise<PartRawMaterial> {
    if (!this.db) await this.initialize();
    await this.db!.put('partRawMaterials', item);
    return item;
  }

  async deletePartRawMaterial(id: string): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.delete('partRawMaterials', id);
  }

  // Calendar methods
  async getCalendarState(): Promise<CalendarState | null> {
    if (!this.db) await this.initialize();
    try {
      return await this.db!.get('calendar', 'calendar-state');
    } catch (error) {
      console.error('Error getting calendar state:', error);
      return null;
    }
  }

  async setCalendarState(calendarState: CalendarState): Promise<void> {
    if (!this.db) await this.initialize();
    try {
      // Always use the same key for the calendar state
      const stateToStore = { ...calendarState, viewDate: 'calendar-state' };
      await this.db!.put('calendar', stateToStore);
    } catch (error) {
      console.error('Error setting calendar state:', error);
    }
  }
}

export default new DatabaseService();
