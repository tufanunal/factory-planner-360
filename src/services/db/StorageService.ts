
/**
 * Service to handle localStorage operations
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
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    }
    return null;
  }
  
  async saveToStorage(data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const dataToSave = JSON.stringify(data);
        localStorage.setItem(this.storageKey, dataToSave);
        console.log('Data saved to storage successfully');
        resolve();
      } catch (error) {
        console.error('Failed to save data to storage:', error);
        reject(error);
      }
    });
  }
}
