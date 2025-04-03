
import { Machine, Part, Consumable, RawMaterial, Unit, CalendarState, PartConsumable, PartRawMaterial } from '@/types/all';

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * This service uses localStorage as a persistence layer.
 * It's named SqlDatabaseService for compatibility reasons but actually doesn't use SQL.
 * 
 * NOTE: This isn't a true SQL database. In a production environment, 
 * this would be replaced with a real database implementation.
 */
class SqlDatabaseService {
  private db: any = null;
  private initialized = false;
  private storageKey = 'factory-planner-data';
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Load data from localStorage first
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
        await this.saveToStorage();
      }
      
      this.initialized = true;
      console.info('Data persistence layer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize persistence layer:', error);
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
        
        // Make sure calendar data has correct structure if it exists
        if (this.db.calendar) {
          this.db.calendar.shiftTimes = this.db.calendar.shiftTimes || [];
          this.db.calendar.dayShiftToggles = this.db.calendar.dayShiftToggles || [];
          this.db.calendar.holidays = this.db.calendar.holidays || [];
          this.db.calendar.viewDate = this.db.calendar.viewDate || new Date().toISOString().split('T')[0];
        }
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
  
  private async saveToStorage(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        // Check if database is initialized before saving
        if (!this.db) {
          console.error('Attempted to save before database was initialized');
          reject(new Error('Database not initialized'));
          return;
        }
        
        const dataToSave = JSON.stringify(this.db);
        localStorage.setItem(this.storageKey, dataToSave);
        console.log('Data saved to storage successfully');
        resolve();
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
          resolve();
        } catch (fallbackError) {
          console.error('Critical error: Could not save even minimal data', fallbackError);
          reject(fallbackError);
        }
      }
    });
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
    
    await this.saveToStorage();
    return unit;
  }

  async deleteUnit(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.units = this.db.units.filter((u: Unit) => u.id !== id);
    await this.saveToStorage();
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
    
    await this.saveToStorage();
    return machine;
  }

  async deleteMachine(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.machines = this.db.machines.filter((m: Machine) => m.id !== id);
    await this.saveToStorage();
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
    
    await this.saveToStorage();
    return part;
  }

  async deletePart(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.parts = this.db.parts.filter((p: Part) => p.id !== id);
    await this.saveToStorage();
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
    
    await this.saveToStorage();
    return consumable;
  }

  async deleteConsumable(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.consumables = this.db.consumables.filter((c: Consumable) => c.id !== id);
    await this.saveToStorage();
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
    
    await this.saveToStorage();
    return material;
  }

  async deleteRawMaterial(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.rawMaterials = this.db.rawMaterials.filter((m: RawMaterial) => m.id !== id);
    await this.saveToStorage();
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
    
    await this.saveToStorage();
    return partConsumable;
  }

  async deletePartConsumable(partId: string, consumableId: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.partConsumables = this.db.partConsumables.filter(
      (pc: PartConsumable) => !(pc.partId === partId && pc.consumableId === consumableId)
    );
    await this.saveToStorage();
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
    
    await this.saveToStorage();
    return partRawMaterial;
  }

  async deletePartRawMaterial(partId: string, rawMaterialId: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.db.partRawMaterials = this.db.partRawMaterials.filter(
      (prm: PartRawMaterial) => !(prm.partId === partId && prm.rawMaterialId === rawMaterialId)
    );
    await this.saveToStorage();
  }

  // Calendar methods
  async getCalendarState(): Promise<CalendarState | null> {
    if (!this.initialized) await this.initialize();
    
    // Deep clone the calendar data to prevent reference issues
    if (this.db.calendar) {
      console.log("Getting calendar state, current data:", this.db.calendar);
      return JSON.parse(JSON.stringify(this.db.calendar));
    }
    return this.db.calendar;
  }

  async setCalendarState(calendarState: CalendarState): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    // Ensure all calendar properties have the correct structure
    if (!calendarState.shiftTimes) calendarState.shiftTimes = [];
    if (!calendarState.dayShiftToggles) calendarState.dayShiftToggles = [];
    if (!calendarState.holidays) calendarState.holidays = [];
    if (!calendarState.viewDate) calendarState.viewDate = new Date().toISOString().split('T')[0];
    
    // Make a deep clone of the calendar state to prevent reference issues
    this.db.calendar = JSON.parse(JSON.stringify(calendarState));
    console.log("Saving calendar state:", this.db.calendar);
    
    try {
      await this.saveToStorage();
      console.log("Calendar state saved successfully");
    } catch (error) {
      console.error("Error saving calendar state:", error);
      throw error;
    }
  }
  
  // For debugging and troubleshooting
  async dumpDatabase(): Promise<any> {
    if (!this.initialized) await this.initialize();
    return this.db;
  }
  
  async clearDatabase(): Promise<void> {
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
    await this.saveToStorage();
    console.log("Database cleared");
  }
}

export default new SqlDatabaseService();
