
import SqlDatabaseService from './SqlDatabaseService'; // Local storage implementation
import { 
  Machine, 
  Part, 
  Consumable, 
  RawMaterial, 
  CalendarState
} from '@/types/all';

// In browser environments, we always use the localStorage implementation
// The PostgreSQL implementation will only be used in a Node.js environment
const isBrowser = typeof window !== 'undefined';

/**
 * Database service adapter that allows switching between implementations
 */
class DatabaseServiceAdapter {
  private service: any;
  
  constructor() {
    // In browser environments, we always use the localStorage implementation
    this.service = SqlDatabaseService;
    console.log(`Using localStorage database implementation (browser environment)`);
  }
  
  async initialize(): Promise<void> {
    try {
      return await this.service.initialize();
    } catch (error) {
      console.error("Error initializing service:", error);
      throw error;
    }
  }
  
  // Machine methods
  async getMachines(): Promise<Machine[]> {
    return this.service.getMachines();
  }
  
  async saveMachine(machine: Machine): Promise<Machine> {
    return this.service.saveMachine(machine);
  }
  
  async deleteMachine(id: string): Promise<void> {
    return this.service.deleteMachine(id);
  }
  
  // Part methods
  async getParts(): Promise<Part[]> {
    return this.service.getParts();
  }
  
  async savePart(part: Part): Promise<Part> {
    return this.service.savePart(part);
  }
  
  async deletePart(id: string): Promise<void> {
    return this.service.deletePart(id);
  }
  
  // Part category methods
  async updatePartCategories(oldCategory: string, newCategory: string): Promise<void> {
    return this.service.updatePartCategories(oldCategory, newCategory);
  }
  
  async revertCategoryToDefault(categoryToDelete: string): Promise<number> {
    return this.service.revertCategoryToDefault(categoryToDelete);
  }
  
  // Consumable methods
  async getConsumables(): Promise<Consumable[]> {
    return this.service.getConsumables();
  }
  
  async saveConsumable(consumable: Consumable): Promise<Consumable> {
    return this.service.saveConsumable(consumable);
  }
  
  async deleteConsumable(id: string): Promise<void> {
    return this.service.deleteConsumable(id);
  }
  
  // Raw Material methods
  async getRawMaterials(): Promise<RawMaterial[]> {
    return this.service.getRawMaterials();
  }
  
  async saveRawMaterial(material: RawMaterial): Promise<RawMaterial> {
    return this.service.saveRawMaterial(material);
  }
  
  async deleteRawMaterial(id: string): Promise<void> {
    return this.service.deleteRawMaterial(id);
  }
  
  // Calendar methods
  async getCalendarState(): Promise<CalendarState | null> {
    return this.service.getCalendarState();
  }
  
  async setCalendarState(calendarState: CalendarState): Promise<void> {
    return this.service.setCalendarState(calendarState);
  }
  
  // For debugging and troubleshooting
  async dumpDatabase(): Promise<any> {
    return this.service.dumpDatabase();
  }
  
  async clearDatabase(): Promise<void> {
    return this.service.clearDatabase();
  }
}

export default new DatabaseServiceAdapter();
