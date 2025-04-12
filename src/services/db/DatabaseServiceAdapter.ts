
import SqlDatabaseService from './SqlDatabaseService'; // Local storage implementation

/**
 * Database service adapter that allows switching between implementations
 */
class DatabaseServiceAdapter {
  private service: any;
  
  constructor() {
    // We'll always use the SqlDatabaseService (with IndexedDB/localStorage)
    // for browser environments
    this.service = SqlDatabaseService;
    console.log(`Using browser-compatible database implementation`);
  }
  
  async initialize(): Promise<void> {
    try {
      console.log("Initializing database service...");
      return await this.service.initialize();
    } catch (error) {
      console.error("Error initializing service:", error);
      throw error;
    }
  }
  
  // Machine methods
  async getMachines() {
    try {
      return await this.service.getMachines();
    } catch (error) {
      console.error("Error getting machines:", error);
      return [];
    }
  }
  
  async saveMachine(machine) {
    try {
      return await this.service.saveMachine(machine);
    } catch (error) {
      console.error("Error saving machine:", error);
      throw error;
    }
  }
  
  async deleteMachine(id) {
    try {
      return await this.service.deleteMachine(id);
    } catch (error) {
      console.error("Error deleting machine:", error);
      throw error;
    }
  }
  
  // Part methods
  async getParts() {
    try {
      return await this.service.getParts();
    } catch (error) {
      console.error("Error getting parts:", error);
      return [];
    }
  }
  
  async savePart(part) {
    try {
      return await this.service.savePart(part);
    } catch (error) {
      console.error("Error saving part:", error);
      throw error;
    }
  }
  
  async deletePart(id) {
    try {
      return await this.service.deletePart(id);
    } catch (error) {
      console.error("Error deleting part:", error);
      throw error;
    }
  }
  
  // Part category methods
  async updatePartCategories(oldCategory, newCategory) {
    try {
      return await this.service.updatePartCategories(oldCategory, newCategory);
    } catch (error) {
      console.error("Error updating part categories:", error);
      throw error;
    }
  }
  
  async revertCategoryToDefault(categoryToDelete) {
    try {
      return await this.service.revertCategoryToDefault(categoryToDelete);
    } catch (error) {
      console.error("Error reverting category to default:", error);
      throw error;
    }
  }
  
  // Consumable methods
  async getConsumables() {
    try {
      return await this.service.getConsumables();
    } catch (error) {
      console.error("Error getting consumables:", error);
      return [];
    }
  }
  
  async saveConsumable(consumable) {
    try {
      return await this.service.saveConsumable(consumable);
    } catch (error) {
      console.error("Error saving consumable:", error);
      throw error;
    }
  }
  
  async deleteConsumable(id) {
    try {
      return await this.service.deleteConsumable(id);
    } catch (error) {
      console.error("Error deleting consumable:", error);
      throw error;
    }
  }
  
  // Raw Material methods
  async getRawMaterials() {
    try {
      return await this.service.getRawMaterials();
    } catch (error) {
      console.error("Error getting raw materials:", error);
      return [];
    }
  }
  
  async saveRawMaterial(material) {
    try {
      return await this.service.saveRawMaterial(material);
    } catch (error) {
      console.error("Error saving raw material:", error);
      throw error;
    }
  }
  
  async deleteRawMaterial(id) {
    try {
      return await this.service.deleteRawMaterial(id);
    } catch (error) {
      console.error("Error deleting raw material:", error);
      throw error;
    }
  }
  
  // Calendar methods
  async getCalendarState() {
    try {
      return await this.service.getCalendarState();
    } catch (error) {
      console.error("Error getting calendar state:", error);
      return null;
    }
  }
  
  async setCalendarState(calendarState) {
    try {
      return await this.service.setCalendarState(calendarState);
    } catch (error) {
      console.error("Error setting calendar state:", error);
      throw error;
    }
  }
  
  // For debugging and troubleshooting
  async dumpDatabase() {
    try {
      return await this.service.dumpDatabase();
    } catch (error) {
      console.error("Error dumping database:", error);
      return null;
    }
  }
  
  async clearDatabase() {
    try {
      return await this.service.clearDatabase();
    } catch (error) {
      console.error("Error clearing database:", error);
      throw error;
    }
  }
}

export default new DatabaseServiceAdapter();
