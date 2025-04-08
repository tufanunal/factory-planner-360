
import { StorageService } from './StorageService';

/**
 * Core database manager that handles initialization and persistence
 */
export class DatabaseManager {
  private db: any = null;
  private initialized = false;
  private storageService: StorageService;
  
  constructor(storageKey: string) {
    this.storageService = new StorageService(storageKey);
  }
  
  async initialize(): Promise<any> {
    if (this.initialized) return this.db;
    
    try {
      // Attempt to load data from localStorage
      this.loadFromStorage();
      
      // Ensure db is initialized with proper structure
      if (!this.db) {
        // Initialize with empty data structure
        this.initializeEmptyDatabase();
        // Save initial data structure
        await this.saveToStorage();
      } else {
        // Ensure all required collections exist in the loaded data
        this.ensureDataStructure();
      }
      
      this.initialized = true;
      console.info('Data persistence layer initialized successfully:', this.db);
      return this.db;
    } catch (error) {
      console.error('Failed to initialize persistence layer:', error);
      // Initialize with empty data in case of error
      this.initializeEmptyDatabase();
      this.initialized = true;
      throw error;
    }
  }
  
  isInitialized(): boolean {
    return this.initialized;
  }
  
  getDatabase(): any {
    return this.db;
  }
  
  private initializeEmptyDatabase(): void {
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
    console.log('Initialized empty database structure');
  }
  
  private ensureDataStructure(): void {
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
    console.log('Ensured database structure is complete');
  }
  
  private loadFromStorage(): void {
    try {
      const loadedDb = this.storageService.loadFromStorage<any>();
      if (loadedDb) {
        this.db = loadedDb;
        console.log('Database loaded from storage successfully:', this.db);
      } else {
        console.warn('No data found in storage, will initialize empty database');
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      this.db = null;
    }
  }
  
  async saveToStorage(): Promise<void> {
    if (!this.db) {
      console.error('Attempted to save before database was initialized');
      throw new Error('Database not initialized');
    }
    
    try {
      await this.storageService.saveToStorage(this.db);
      console.log('Database saved to storage successfully');
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
  
  // For debugging and troubleshooting
  dumpDatabase(): any {
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
