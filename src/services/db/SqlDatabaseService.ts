
import { Machine, Part, Consumable, RawMaterial, Unit, CalendarState, PartConsumable, PartRawMaterial } from '@/types/all';

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

class SqlDatabaseService {
  private db: any = null;
  private initialized = false;
  private storageKey = 'factory-planner-data';

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Load data from localStorage
      this.loadFromStorage();
      
      if (!this.db) {
        // Initialize with empty data
        this.db = {
          machines: [],
          parts: [],
          consumables: [],
          rawMaterials: [],
          units: [],
          calendar: null,
          partConsumables: [],
          partRawMaterials: []
        };
        
        // Save initial data
        this.saveToStorage();
      }
      
      this.initialized = true;
      console.info('SQL Database Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
  
  private loadFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        this.db = JSON.parse(storedData);
        console.log('Data loaded from storage:', this.db);
        
        // Ensure all required collections exist
        this.db.machines = this.db.machines || [];
        this.db.parts = this.db.parts || [];
        this.db.consumables = this.db.consumables || [];
        this.db.rawMaterials = this.db.rawMaterials || [];
        this.db.units = this.db.units || [];
        this.db.partConsumables = this.db.partConsumables || [];
        this.db.partRawMaterials = this.db.partRawMaterials || [];
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      // Initialize with empty data in case of error
      this.db = {
        machines: [],
        parts: [],
        consumables: [],
        rawMaterials: [],
        units: [],
        calendar: null,
        partConsumables: [],
        partRawMaterials: []
      };
    }
  }
  
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.db));
      console.log('Data saved to storage:', this.db);
    } catch (error) {
      console.error('Failed to save data to storage:', error);
      // Try to save with minimal data if storage limit is an issue
      try {
        const minimalData = { 
          machines: this.db.machines, 
          parts: this.db.parts,
          consumables: this.db.consumables,
          rawMaterials: this.db.rawMaterials,
          calendar: this.db.calendar
        };
        localStorage.setItem(this.storageKey, JSON.stringify(minimalData));
        console.log('Saved minimal data to storage');
      } catch (fallbackError) {
        console.error('Critical error: Could not save even minimal data', fallbackError);
      }
    }
  }

  // Units methods
  async getUnits(): Promise<Unit[]> {
    if (!this.initialized) await this.initialize();
    return this.db.units || [];
  }

  async saveUnit(unit: Unit): Promise<Unit> {
    if (!this.initialized) await this.initialize();
    
    const existingIndex = this.db.units.findIndex((u: Unit) => u.id === unit.id);
    if (existingIndex >= 0) {
      this.db.units[existingIndex] = unit;
    } else {
      if (!unit.id) {
        unit.id = generateId();
      }
      this.db.units.push(unit);
    }
    
    this.saveToStorage();
    return unit;
  }

  async deleteUnit(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.units = this.db.units.filter((u: Unit) => u.id !== id);
    this.saveToStorage();
  }

  // Machine methods
  async getMachines(): Promise<Machine[]> {
    if (!this.initialized) await this.initialize();
    return this.db.machines || [];
  }

  async saveMachine(machine: Machine): Promise<Machine> {
    if (!this.initialized) await this.initialize();
    
    const existingIndex = this.db.machines.findIndex((m: Machine) => m.id === machine.id);
    if (existingIndex >= 0) {
      this.db.machines[existingIndex] = machine;
    } else {
      if (!machine.id) {
        machine.id = generateId();
      }
      this.db.machines.push(machine);
    }
    
    this.saveToStorage();
    return machine;
  }

  async deleteMachine(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.machines = this.db.machines.filter((m: Machine) => m.id !== id);
    this.saveToStorage();
  }

  // Part methods
  async getParts(): Promise<Part[]> {
    if (!this.initialized) await this.initialize();
    return this.db.parts || [];
  }

  async savePart(part: Part): Promise<Part> {
    if (!this.initialized) await this.initialize();
    
    const existingIndex = this.db.parts.findIndex((p: Part) => p.id === part.id);
    if (existingIndex >= 0) {
      this.db.parts[existingIndex] = part;
    } else {
      if (!part.id) {
        part.id = generateId();
      }
      this.db.parts.push(part);
    }
    
    this.saveToStorage();
    return part;
  }

  async deletePart(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.parts = this.db.parts.filter((p: Part) => p.id !== id);
    this.saveToStorage();
  }

  // Consumable methods
  async getConsumables(): Promise<Consumable[]> {
    if (!this.initialized) await this.initialize();
    return this.db.consumables || [];
  }

  async saveConsumable(consumable: Consumable): Promise<Consumable> {
    if (!this.initialized) await this.initialize();
    
    const existingIndex = this.db.consumables.findIndex((c: Consumable) => c.id === consumable.id);
    if (existingIndex >= 0) {
      this.db.consumables[existingIndex] = consumable;
    } else {
      if (!consumable.id) {
        consumable.id = generateId();
      }
      this.db.consumables.push(consumable);
    }
    
    this.saveToStorage();
    return consumable;
  }

  async deleteConsumable(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.consumables = this.db.consumables.filter((c: Consumable) => c.id !== id);
    this.saveToStorage();
  }

  // Raw Material methods
  async getRawMaterials(): Promise<RawMaterial[]> {
    if (!this.initialized) await this.initialize();
    return this.db.rawMaterials || [];
  }

  async saveRawMaterial(material: RawMaterial): Promise<RawMaterial> {
    if (!this.initialized) await this.initialize();
    
    const existingIndex = this.db.rawMaterials.findIndex((m: RawMaterial) => m.id === material.id);
    if (existingIndex >= 0) {
      this.db.rawMaterials[existingIndex] = material;
    } else {
      if (!material.id) {
        material.id = generateId();
      }
      this.db.rawMaterials.push(material);
    }
    
    this.saveToStorage();
    return material;
  }

  async deleteRawMaterial(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.rawMaterials = this.db.rawMaterials.filter((m: RawMaterial) => m.id !== id);
    this.saveToStorage();
  }

  // Part Consumable methods
  async getPartConsumables(): Promise<PartConsumable[]> {
    if (!this.initialized) await this.initialize();
    return this.db.partConsumables || [];
  }

  async savePartConsumable(partConsumable: PartConsumable): Promise<PartConsumable> {
    if (!this.initialized) await this.initialize();
    
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
    
    this.saveToStorage();
    return partConsumable;
  }

  async deletePartConsumable(partId: string, consumableId: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.partConsumables = this.db.partConsumables.filter(
      (pc: PartConsumable) => !(pc.partId === partId && pc.consumableId === consumableId)
    );
    this.saveToStorage();
  }

  // Part Raw Material methods
  async getPartRawMaterials(): Promise<PartRawMaterial[]> {
    if (!this.initialized) await this.initialize();
    return this.db.partRawMaterials || [];
  }

  async savePartRawMaterial(partRawMaterial: PartRawMaterial): Promise<PartRawMaterial> {
    if (!this.initialized) await this.initialize();
    
    const existingIndex = this.db.partRawMaterials.findIndex(
      (prm: PartRawMaterial) => prm.partId === partRawMaterial.partId && prm.rawMaterialId === partRawMaterial.rawMaterialId
    );
    
    if (existingIndex >= 0) {
      this.db.partRawMaterials[existingIndex] = partRawMaterial;
    } else {
      if (!partRawMaterial.id) {
        partRawMaterial.id = generateId();
      }
      this.db.partRawMaterials.push(partRawMaterial);
    }
    
    this.saveToStorage();
    return partRawMaterial;
  }

  async deletePartRawMaterial(partId: string, rawMaterialId: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.partRawMaterials = this.db.partRawMaterials.filter(
      (prm: PartRawMaterial) => !(prm.partId === partId && prm.rawMaterialId === rawMaterialId)
    );
    this.saveToStorage();
  }

  // Calendar methods
  async getCalendarState(): Promise<CalendarState | null> {
    if (!this.initialized) await this.initialize();
    return this.db.calendar;
  }

  async setCalendarState(calendarState: CalendarState): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.calendar = calendarState;
    this.saveToStorage();
  }
}

export default new SqlDatabaseService();
