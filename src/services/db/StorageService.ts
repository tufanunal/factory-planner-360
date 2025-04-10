
/**
 * Service to handle localStorage operations with improved error handling and logging
 */
export class StorageService {
  private storageKey: string;
  
  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }
  
  loadFromStorage<T>(): T | null {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log(`Successfully loaded data from ${this.storageKey}:`, parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error(`Failed to load data from ${this.storageKey}:`, error);
    }
    console.warn(`No data found in ${this.storageKey}`);
    return null;
  }
  
  async saveToStorage(data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        if (data === undefined || data === null) {
          console.error(`Attempted to save undefined or null data to ${this.storageKey}`);
          reject(new Error('Cannot save undefined or null data'));
          return;
        }
        
        const dataToSave = JSON.stringify(data);
        localStorage.setItem(this.storageKey, dataToSave);
        console.log(`Data saved to ${this.storageKey} successfully:`, data);
        resolve();
      } catch (error) {
        console.error(`Failed to save data to ${this.storageKey}:`, error);
        reject(error);
      }
    });
  }
  
  clearStorage(): void {
    try {
      localStorage.removeItem(this.storageKey);
      console.log(`Storage key ${this.storageKey} cleared successfully`);
    } catch (error) {
      console.error(`Failed to clear storage key ${this.storageKey}:`, error);
    }
  }
}
