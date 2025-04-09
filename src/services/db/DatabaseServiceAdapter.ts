import SqlDatabaseService from './SqlDatabaseService'; // Local storage implementation
import PostgresService from './PostgresService'; // PostgreSQL implementation
import { 
  Machine, 
  Part, 
  Consumable, 
  RawMaterial, 
  CalendarState
} from '@/types/all';

// Toggle which implementation to use
const USE_POSTGRES = process.env.USE_POSTGRES === 'true';

/**
 * Database service adapter that allows switching between implementations
 */
class DatabaseServiceAdapter {
  private service: any;
  
  constructor() {
    // Choose the appropriate implementation
    this.service = USE_POSTGRES ? PostgresService : SqlDatabaseService;
    console.log(`Using ${USE_POSTGRES ? 'PostgreSQL' : 'localStorage'} database implementation`);
  }
  
  async initialize(): Promise<void> {
    try {
      return await this.service.initialize();
    } catch (error) {
      console.error("Error initializing service:", error);
      // If postgres fails, fallback to SQL service
      if (USE_POSTGRES) {
        console.log("Falling back to localStorage database");
        this.service = SqlDatabaseService;
        return this.service.initialize();
      }
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
