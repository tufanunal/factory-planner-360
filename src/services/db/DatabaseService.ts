
import { openDB, IDBPDatabase } from 'idb';
import { 
  Machine, 
  Part, 
  Consumable, 
  RawMaterial, 
  Calendar, 
  Shift 
} from '@/types/all';
import { toast } from 'sonner';

const DB_NAME = 'factory-management-db';
const DB_VERSION = 1;

export interface DatabaseService {
  // DB initialization
  init(): Promise<void>;
  
  // General operations
  getItem<T>(storeName: string, id: string | number): Promise<T | undefined>;
  getAllItems<T>(storeName: string): Promise<T[]>;
  saveItem<T>(storeName: string, item: T): Promise<T>;
  saveItems<T>(storeName: string, items: T[]): Promise<T[]>;
  deleteItem(storeName: string, id: string | number): Promise<void>;
  
  // Calendar specific operations
  getCalendars(): Promise<Calendar[]>;
  saveCalendar(calendar: Calendar): Promise<Calendar>;
  deleteCalendar(id: string): Promise<void>;
  
  // Shift specific operations
  getShifts(): Promise<Shift[]>;
  saveShift(shift: Shift): Promise<Shift>;
  deleteShift(id: number): Promise<void>;
  
  // Machine operations
  getMachines(): Promise<Machine[]>;
  saveMachine(machine: Machine): Promise<Machine>;
  deleteMachine(id: string): Promise<void>;
  
  // Part operations
  getParts(): Promise<Part[]>;
  savePart(part: Part): Promise<Part>;
  deletePart(id: string): Promise<void>;
  
  // Consumable operations
  getConsumables(): Promise<Consumable[]>;
  saveConsumable(consumable: Consumable): Promise<Consumable>;
  deleteConsumable(id: string): Promise<void>;
  
  // Raw material operations
  getRawMaterials(): Promise<RawMaterial[]>;
  saveRawMaterial(material: RawMaterial): Promise<RawMaterial>;
  deleteRawMaterial(id: string): Promise<void>;
  
  // Categories, units and settings
  getCategories(type: 'machine' | 'part'): Promise<string[]>;
  saveCategories(type: 'machine' | 'part', categories: string[]): Promise<string[]>;
  
  getUnits(): Promise<string[]>;
  saveUnits(units: string[]): Promise<string[]>;
  
  getSetting(key: string): Promise<any>;
  saveSetting(key: string, value: any): Promise<void>;
}

class IndexedDBService implements DatabaseService {
  private db: IDBPDatabase | null = null;
  
  // Initialize database
  async init(): Promise<void> {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
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
          
          if (!db.objectStoreNames.contains('calendars')) {
            db.createObjectStore('calendars', { keyPath: 'id' });
          }
          
          if (!db.objectStoreNames.contains('shifts')) {
            db.createObjectStore('shifts', { keyPath: 'id' });
          }
          
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        }
      });
      
      console.log('Database initialized successfully');
      
      // Migrate existing data from localStorage
      await this.migrateFromLocalStorage();
      
    } catch (error) {
      console.error('Failed to init database:', error);
      toast.error('Failed to initialize database');
    }
  }
  
  // General operations
  async getItem<T>(storeName: string, id: string | number): Promise<T | undefined> {
    if (!this.db) await this.init();
    return this.db!.get(storeName, id);
  }
  
  async getAllItems<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();
    return this.db!.getAll(storeName);
  }
  
  async saveItem<T>(storeName: string, item: T): Promise<T> {
    if (!this.db) await this.init();
    await this.db!.put(storeName, item);
    return item;
  }
  
  async saveItems<T>(storeName: string, items: T[]): Promise<T[]> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    for (const item of items) {
      await store.put(item);
    }
    
    await tx.done;
    return items;
  }
  
  async deleteItem(storeName: string, id: string | number): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete(storeName, id);
  }
  
  // Calendar operations
  async getCalendars(): Promise<Calendar[]> {
    return this.getAllItems<Calendar>('calendars');
  }
  
  async saveCalendar(calendar: Calendar): Promise<Calendar> {
    return this.saveItem<Calendar>('calendars', calendar);
  }
  
  async deleteCalendar(id: string): Promise<void> {
    return this.deleteItem('calendars', id);
  }
  
  // Shift operations
  async getShifts(): Promise<Shift[]> {
    return this.getAllItems<Shift>('shifts');
  }
  
  async saveShift(shift: Shift): Promise<Shift> {
    return this.saveItem<Shift>('shifts', shift);
  }
  
  async deleteShift(id: number): Promise<void> {
    return this.deleteItem('shifts', id);
  }
  
  // Machine operations
  async getMachines(): Promise<Machine[]> {
    return this.getAllItems<Machine>('machines');
  }
  
  async saveMachine(machine: Machine): Promise<Machine> {
    return this.saveItem<Machine>('machines', machine);
  }
  
  async deleteMachine(id: string): Promise<void> {
    return this.deleteItem('machines', id);
  }
  
  // Part operations
  async getParts(): Promise<Part[]> {
    return this.getAllItems<Part>('parts');
  }
  
  async savePart(part: Part): Promise<Part> {
    return this.saveItem<Part>('parts', part);
  }
  
  async deletePart(id: string): Promise<void> {
    return this.deleteItem('parts', id);
  }
  
  // Consumable operations
  async getConsumables(): Promise<Consumable[]> {
    return this.getAllItems<Consumable>('consumables');
  }
  
  async saveConsumable(consumable: Consumable): Promise<Consumable> {
    return this.saveItem<Consumable>('consumables', consumable);
  }
  
  async deleteConsumable(id: string): Promise<void> {
    return this.deleteItem('consumables', id);
  }
  
  // Raw material operations
  async getRawMaterials(): Promise<RawMaterial[]> {
    return this.getAllItems<RawMaterial>('rawMaterials');
  }
  
  async saveRawMaterial(material: RawMaterial): Promise<RawMaterial> {
    return this.saveItem<RawMaterial>('rawMaterials', material);
  }
  
  async deleteRawMaterial(id: string): Promise<void> {
    return this.deleteItem('rawMaterials', id);
  }
  
  // Categories and units
  async getCategories(type: 'machine' | 'part'): Promise<string[]> {
    const setting = await this.getSetting(`${type}Categories`);
    return setting || [];
  }
  
  async saveCategories(type: 'machine' | 'part', categories: string[]): Promise<string[]> {
    await this.saveSetting(`${type}Categories`, categories);
    return categories;
  }
  
  async getUnits(): Promise<string[]> {
    const units = await this.getSetting('units');
    return units || [];
  }
  
  async saveUnits(units: string[]): Promise<string[]> {
    await this.saveSetting('units', units);
    return units;
  }
  
  // Settings
  async getSetting(key: string): Promise<any> {
    try {
      const setting = await this.getItem('settings', key);
      return setting ? setting.value : null;
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return null;
    }
  }
  
  async saveSetting(key: string, value: any): Promise<void> {
    await this.saveItem('settings', { key, value });
  }
  
  // Migration from localStorage
  private async migrateFromLocalStorage(): Promise<void> {
    try {
      // Migrate machines
      const storedMachines = localStorage.getItem('machines');
      if (storedMachines) {
        const machines = JSON.parse(storedMachines);
        await this.saveItems('machines', machines);
      }
      
      // Migrate parts
      const storedParts = localStorage.getItem('parts');
      if (storedParts) {
        const parts = JSON.parse(storedParts);
        await this.saveItems('parts', parts);
      }
      
      // Migrate consumables
      const storedConsumables = localStorage.getItem('consumables');
      if (storedConsumables) {
        const consumables = JSON.parse(storedConsumables);
        await this.saveItems('consumables', consumables);
      }
      
      // Migrate raw materials
      const storedRawMaterials = localStorage.getItem('rawMaterials');
      if (storedRawMaterials) {
        const rawMaterials = JSON.parse(storedRawMaterials);
        await this.saveItems('rawMaterials', rawMaterials);
      }
      
      // Migrate calendars - with date parsing
      const storedCalendars = localStorage.getItem('calendars');
      if (storedCalendars) {
        const calendars = JSON.parse(storedCalendars);
        // Convert date strings to Date objects
        const parsedCalendars = calendars.map((calendar: any) => ({
          ...calendar,
          holidays: calendar.holidays.map((holiday: any) => ({
            ...holiday,
            date: new Date(holiday.date)
          }))
        }));
        await this.saveItems('calendars', parsedCalendars);
      }
      
      // Migrate shifts
      const storedShifts = localStorage.getItem('shifts');
      if (storedShifts) {
        const shifts = JSON.parse(storedShifts);
        await this.saveItems('shifts', shifts);
      }
      
      // Migrate machine categories
      const storedMachineCategories = localStorage.getItem('machineCategories');
      if (storedMachineCategories) {
        await this.saveSetting('machineCategories', JSON.parse(storedMachineCategories));
      }
      
      // Migrate part categories
      const storedPartCategories = localStorage.getItem('partCategories');
      if (storedPartCategories) {
        await this.saveSetting('partCategories', JSON.parse(storedPartCategories));
      }
      
      // Migrate units
      const storedUnits = localStorage.getItem('units');
      if (storedUnits) {
        await this.saveSetting('units', JSON.parse(storedUnits));
      }
      
      // Migrate active calendar ID
      const activeCalendarId = localStorage.getItem('activeCalendarId');
      if (activeCalendarId) {
        await this.saveSetting('activeCalendarId', activeCalendarId);
      }
      
      console.log('Data migration from localStorage completed');
    } catch (error) {
      console.error('Error during migration from localStorage:', error);
      toast.error('Error migrating data from localStorage');
    }
  }
}

// Create and export a singleton instance
export const db = new IndexedDBService();
export default db;
