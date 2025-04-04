
import { Machine, Part, Consumable, RawMaterial, Unit, CalendarState, PartConsumable, PartRawMaterial } from '@/types/all';
import { StorageService } from './StorageService';
import { UnitService } from './UnitService';
import { MachineService } from './MachineService';
import { PartService } from './PartService';
import { ConsumableService } from './ConsumableService';
import { RawMaterialService } from './RawMaterialService';
import { PartConsumableService } from './PartConsumableService';
import { PartRawMaterialService } from './PartRawMaterialService';
import { CalendarService } from './CalendarService';

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
  private storageService: StorageService;
  
  // Service instances
  private unitService: UnitService;
  private machineService: MachineService;
  private partService: PartService;
  private consumableService: ConsumableService;
  private rawMaterialService: RawMaterialService;
  private partConsumableService: PartConsumableService;
  private partRawMaterialService: PartRawMaterialService;
  private calendarService: CalendarService;
  
  constructor() {
    this.storageService = new StorageService('factory-planner-data');
    
    // These will be initialized after this.db is loaded
    this.unitService = new UnitService(this.db);
    this.machineService = new MachineService(this.db);
    this.partService = new PartService(this.db);
    this.consumableService = new ConsumableService(this.db);
    this.rawMaterialService = new RawMaterialService(this.db);
    this.partConsumableService = new PartConsumableService(this.db);
    this.partRawMaterialService = new PartRawMaterialService(this.db);
    this.calendarService = new CalendarService(this.db);
  }
  
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
      
      // Reinitialize services with the loaded db
      this.initializeServices();
      
      this.initialized = true;
      console.info('Data persistence layer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize persistence layer:', error);
      throw error;
    }
  }
  
  private initializeServices(): void {
    this.unitService = new UnitService(this.db);
    this.machineService = new MachineService(this.db);
    this.partService = new PartService(this.db);
    this.consumableService = new ConsumableService(this.db);
    this.rawMaterialService = new RawMaterialService(this.db);
    this.partConsumableService = new PartConsumableService(this.db);
    this.partRawMaterialService = new PartRawMaterialService(this.db);
    this.calendarService = new CalendarService(this.db);
  }
  
  private loadFromStorage(): void {
    try {
      const loadedDb = this.storageService.loadFromStorage<any>();
      if (loadedDb) {
        this.db = loadedDb;
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
    if (!this.db) {
      console.error('Attempted to save before database was initialized');
      throw new Error('Database not initialized');
    }
    
    try {
      await this.storageService.saveToStorage(this.db);
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
        await this.storageService.saveToStorage(minimalData);
        console.log('Saved minimal data to storage');
      } catch (fallbackError) {
        console.error('Critical error: Could not save even minimal data', fallbackError);
        throw fallbackError;
      }
    }
  }

  // Unit methods
  async getUnits(): Promise<Unit[]> {
    if (!this.initialized) await this.initialize();
    return this.unitService.getUnits();
  }

  async saveUnit(unit: Unit): Promise<Unit> {
    if (!this.initialized) await this.initialize();
    const savedUnit = this.unitService.saveUnit(unit);
    await this.saveToStorage();
    return savedUnit;
  }

  async deleteUnit(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.unitService.deleteUnit(id);
    await this.saveToStorage();
  }

  // Machine methods
  async getMachines(): Promise<Machine[]> {
    if (!this.initialized) await this.initialize();
    return this.machineService.getMachines();
  }

  async saveMachine(machine: Machine): Promise<Machine> {
    if (!this.initialized) await this.initialize();
    const savedMachine = this.machineService.saveMachine(machine);
    await this.saveToStorage();
    return savedMachine;
  }

  async deleteMachine(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.machineService.deleteMachine(id);
    await this.saveToStorage();
  }

  // Part methods
  async getParts(): Promise<Part[]> {
    if (!this.initialized) await this.initialize();
    return this.partService.getParts();
  }

  async savePart(part: Part): Promise<Part> {
    if (!this.initialized) await this.initialize();
    const savedPart = this.partService.savePart(part);
    await this.saveToStorage();
    return savedPart;
  }

  async deletePart(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.partService.deletePart(id);
    await this.saveToStorage();
  }

  // Consumable methods
  async getConsumables(): Promise<Consumable[]> {
    if (!this.initialized) await this.initialize();
    return this.consumableService.getConsumables();
  }

  async saveConsumable(consumable: Consumable): Promise<Consumable> {
    if (!this.initialized) await this.initialize();
    const savedConsumable = this.consumableService.saveConsumable(consumable);
    await this.saveToStorage();
    return savedConsumable;
  }

  async deleteConsumable(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.consumableService.deleteConsumable(id);
    await this.saveToStorage();
  }

  // Raw Material methods
  async getRawMaterials(): Promise<RawMaterial[]> {
    if (!this.initialized) await this.initialize();
    return this.rawMaterialService.getRawMaterials();
  }

  async saveRawMaterial(material: RawMaterial): Promise<RawMaterial> {
    if (!this.initialized) await this.initialize();
    const savedMaterial = this.rawMaterialService.saveRawMaterial(material);
    await this.saveToStorage();
    return savedMaterial;
  }

  async deleteRawMaterial(id: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.rawMaterialService.deleteRawMaterial(id);
    await this.saveToStorage();
  }

  // Part Consumable methods
  async getPartConsumables(): Promise<PartConsumable[]> {
    if (!this.initialized) await this.initialize();
    return this.partConsumableService.getPartConsumables();
  }

  async savePartConsumable(partConsumable: PartConsumable): Promise<PartConsumable> {
    if (!this.initialized) await this.initialize();
    const savedPartConsumable = this.partConsumableService.savePartConsumable(partConsumable);
    await this.saveToStorage();
    return savedPartConsumable;
  }

  async deletePartConsumable(partId: string, consumableId: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.partConsumableService.deletePartConsumable(partId, consumableId);
    await this.saveToStorage();
  }

  // Part Raw Material methods
  async getPartRawMaterials(): Promise<PartRawMaterial[]> {
    if (!this.initialized) await this.initialize();
    return this.partRawMaterialService.getPartRawMaterials();
  }

  async savePartRawMaterial(partRawMaterial: PartRawMaterial): Promise<PartRawMaterial> {
    if (!this.initialized) await this.initialize();
    const savedPartRawMaterial = this.partRawMaterialService.savePartRawMaterial(partRawMaterial);
    await this.saveToStorage();
    return savedPartRawMaterial;
  }

  async deletePartRawMaterial(partId: string, rawMaterialId: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.partRawMaterialService.deletePartRawMaterial(partId, rawMaterialId);
    await this.saveToStorage();
  }

  // Calendar methods
  async getCalendarState(): Promise<CalendarState | null> {
    if (!this.initialized) await this.initialize();
    return this.calendarService.getCalendarState();
  }

  async setCalendarState(calendarState: CalendarState): Promise<void> {
    if (!this.initialized) await this.initialize();
    
    this.calendarService.setCalendarState(calendarState);
    
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
