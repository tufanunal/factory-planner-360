
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the database schema
interface FactoryDB extends DBSchema {
  appData: {
    key: string;
    value: any;
  };
}

/**
 * Service to handle storage operations with improved error handling and logging
 * Uses IndexedDB for persistent storage with localStorage as fallback
 */
export class StorageService {
  private storageKey: string;
  private db: IDBPDatabase<FactoryDB> | null = null;
  private dbInitialized = false;
  
  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.initializeDB();
  }
  
  private async initializeDB(): Promise<void> {
    try {
      this.db = await openDB<FactoryDB>('factory-planner-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('appData')) {
            db.createObjectStore('appData');
          }
        },
      });
      this.dbInitialized = true;
      console.log('IndexedDB initialized successfully');
      
      // Migrate data from localStorage if available
      this.migrateFromLocalStorage();
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      this.dbInitialized = false;
    }
  }
  
  private async migrateFromLocalStorage(): Promise<void> {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData && this.db) {
        const parsedData = JSON.parse(storedData);
        await this.db.put('appData', parsedData, this.storageKey);
        console.log('Data migrated from localStorage to IndexedDB');
      }
    } catch (error) {
      console.error('Failed to migrate data from localStorage:', error);
    }
  }
  
  async loadFromStorage<T>(): Promise<T | null> {
    // Wait for DB initialization if needed
    if (!this.dbInitialized) {
      try {
        await this.initializeDB();
      } catch (error) {
        console.error('Failed to initialize DB for loading:', error);
      }
    }
    
    try {
      // Try to load from IndexedDB first
      if (this.db) {
        const data = await this.db.get('appData', this.storageKey);
        if (data) {
          console.log(`Successfully loaded data from IndexedDB:`, data);
          return data;
        }
      }
      
      // Fall back to localStorage if IndexedDB fails
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log(`Successfully loaded data from localStorage:`, parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error(`Failed to load data from storage:`, error);
    }
    
    console.warn(`No data found in storage for ${this.storageKey}`);
    return null;
  }
  
  async saveToStorage(data: any): Promise<void> {
    if (data === undefined || data === null) {
      console.error(`Attempted to save undefined or null data to ${this.storageKey}`);
      throw new Error('Cannot save undefined or null data');
    }
    
    // Wait for DB initialization if needed
    if (!this.dbInitialized) {
      try {
        await this.initializeDB();
      } catch (error) {
        console.error('Failed to initialize DB for saving:', error);
      }
    }
    
    try {
      // Try to save to IndexedDB first
      if (this.db) {
        await this.db.put('appData', data, this.storageKey);
        console.log(`Data saved to IndexedDB successfully:`, data);
      }
      
      // Also save to localStorage as backup
      const dataToSave = JSON.stringify(data);
      localStorage.setItem(this.storageKey, dataToSave);
      console.log(`Data saved to localStorage as backup:`, data);
    } catch (error) {
      console.error(`Failed to save data to storage:`, error);
      
      // Try to save with minimal data if storage limit is an issue
      try {
        const minimalData = { 
          machines: data.machines, 
          parts: data.parts,
          consumables: data.consumables,
          rawMaterials: data.rawMaterials,
          calendar: data.calendar
        };
        
        if (this.db) {
          await this.db.put('appData', minimalData, this.storageKey);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(minimalData));
        console.log('Saved minimal data to storage');
      } catch (fallbackError) {
        console.error('Critical error: Could not save even minimal data', fallbackError);
        throw fallbackError;
      }
    }
  }
  
  async clearStorage(): Promise<void> {
    try {
      if (this.db) {
        await this.db.delete('appData', this.storageKey);
      }
      localStorage.removeItem(this.storageKey);
      console.log(`Storage key ${this.storageKey} cleared successfully`);
    } catch (error) {
      console.error(`Failed to clear storage key ${this.storageKey}:`, error);
    }
  }
}
