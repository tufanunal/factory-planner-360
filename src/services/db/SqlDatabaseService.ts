
import { Machine, Part, Consumable, RawMaterial, Unit, CalendarState, PartConsumable, PartRawMaterial } from '@/types/all';
import { DatabaseManager } from './DatabaseManager';
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
  private databaseManager: DatabaseManager;
  
  // Service instances
  private unitService: UnitService | null = null;
  private machineService: MachineService | null = null;
  private partService: PartService | null = null;
  private consumableService: ConsumableService | null = null;
  private rawMaterialService: RawMaterialService | null = null;
  private partConsumableService: PartConsumableService | null = null;
  private partRawMaterialService: PartRawMaterialService | null = null;
  private calendarService: CalendarService | null = null;
  
  constructor() {
    this.databaseManager = new DatabaseManager('factory-planner-data');
  }
  
  async initialize(): Promise<void> {
    const db = await this.databaseManager.initialize();
    this.initializeServices(db);
  }
  
  private initializeServices(db: any): void {
    this.unitService = new UnitService(db);
    this.machineService = new MachineService(db);
    this.partService = new PartService(db);
    this.consumableService = new ConsumableService(db);
    this.rawMaterialService = new RawMaterialService(db);
    this.partConsumableService = new PartConsumableService(db);
    this.partRawMaterialService = new PartRawMaterialService(db);
    this.calendarService = new CalendarService(db);
  }
  
  private async ensureInitialized(): Promise<void> {
    if (!this.databaseManager.isInitialized()) {
      await this.initialize();
    }
  }
  
  private async saveChanges(): Promise<void> {
    await this.databaseManager.saveToStorage();
  }

  // Unit methods
  async getUnits(): Promise<Unit[]> {
    await this.ensureInitialized();
    return this.unitService!.getUnits();
  }

  async saveUnit(unit: Unit): Promise<Unit> {
    await this.ensureInitialized();
    const savedUnit = this.unitService!.saveUnit(unit);
    await this.saveChanges();
    return savedUnit;
  }

  async deleteUnit(id: string): Promise<void> {
    await this.ensureInitialized();
    this.unitService!.deleteUnit(id);
    await this.saveChanges();
  }

  // Machine methods
  async getMachines(): Promise<Machine[]> {
    await this.ensureInitialized();
    return this.machineService!.getMachines();
  }

  async saveMachine(machine: Machine): Promise<Machine> {
    await this.ensureInitialized();
    const savedMachine = this.machineService!.saveMachine(machine);
    await this.saveChanges();
    return savedMachine;
  }

  async deleteMachine(id: string): Promise<void> {
    await this.ensureInitialized();
    this.machineService!.deleteMachine(id);
    await this.saveChanges();
  }

  // Part methods
  async getParts(): Promise<Part[]> {
    await this.ensureInitialized();
    return this.partService!.getParts();
  }

  async savePart(part: Part): Promise<Part> {
    await this.ensureInitialized();
    const savedPart = this.partService!.savePart(part);
    await this.saveChanges();
    return savedPart;
  }

  async deletePart(id: string): Promise<void> {
    await this.ensureInitialized();
    this.partService!.deletePart(id);
    await this.saveChanges();
  }

  // Consumable methods
  async getConsumables(): Promise<Consumable[]> {
    await this.ensureInitialized();
    return this.consumableService!.getConsumables();
  }

  async saveConsumable(consumable: Consumable): Promise<Consumable> {
    await this.ensureInitialized();
    const savedConsumable = this.consumableService!.saveConsumable(consumable);
    await this.saveChanges();
    return savedConsumable;
  }

  async deleteConsumable(id: string): Promise<void> {
    await this.ensureInitialized();
    this.consumableService!.deleteConsumable(id);
    await this.saveChanges();
  }

  // Raw Material methods
  async getRawMaterials(): Promise<RawMaterial[]> {
    await this.ensureInitialized();
    const materials = this.rawMaterialService!.getRawMaterials();
    console.log('Retrieved raw materials from database:', materials);
    return materials;
  }

  async saveRawMaterial(material: RawMaterial): Promise<RawMaterial> {
    await this.ensureInitialized();
    const savedMaterial = this.rawMaterialService!.saveRawMaterial(material);
    await this.saveChanges();
    console.log('Raw material saved to database:', savedMaterial);
    return savedMaterial;
  }

  async deleteRawMaterial(id: string): Promise<void> {
    await this.ensureInitialized();
    this.rawMaterialService!.deleteRawMaterial(id);
    await this.saveChanges();
    console.log('Raw material deleted from database:', id);
  }

  // Part Consumable methods
  async getPartConsumables(): Promise<PartConsumable[]> {
    await this.ensureInitialized();
    return this.partConsumableService!.getPartConsumables();
  }

  async savePartConsumable(partConsumable: PartConsumable): Promise<PartConsumable> {
    await this.ensureInitialized();
    const savedPartConsumable = this.partConsumableService!.savePartConsumable(partConsumable);
    await this.saveChanges();
    return savedPartConsumable;
  }

  async deletePartConsumable(partId: string, consumableId: string): Promise<void> {
    await this.ensureInitialized();
    this.partConsumableService!.deletePartConsumable(partId, consumableId);
    await this.saveChanges();
  }

  // Part Raw Material methods
  async getPartRawMaterials(): Promise<PartRawMaterial[]> {
    await this.ensureInitialized();
    return this.partRawMaterialService!.getPartRawMaterials();
  }

  async savePartRawMaterial(partRawMaterial: PartRawMaterial): Promise<PartRawMaterial> {
    await this.ensureInitialized();
    const savedPartRawMaterial = this.partRawMaterialService!.savePartRawMaterial(partRawMaterial);
    await this.saveChanges();
    return savedPartRawMaterial;
  }

  async deletePartRawMaterial(partId: string, rawMaterialId: string): Promise<void> {
    await this.ensureInitialized();
    this.partRawMaterialService!.deletePartRawMaterial(partId, rawMaterialId);
    await this.saveChanges();
  }

  // Calendar methods
  async getCalendarState(): Promise<CalendarState | null> {
    await this.ensureInitialized();
    return this.calendarService!.getCalendarState();
  }

  async setCalendarState(calendarState: CalendarState): Promise<void> {
    await this.ensureInitialized();
    
    this.calendarService!.setCalendarState(calendarState);
    
    try {
      await this.saveChanges();
      console.log("Calendar state saved successfully");
    } catch (error) {
      console.error("Error saving calendar state:", error);
      throw error;
    }
  }
  
  // For debugging and troubleshooting
  async dumpDatabase(): Promise<any> {
    await this.ensureInitialized();
    return this.databaseManager.dumpDatabase();
  }
  
  async clearDatabase(): Promise<void> {
    await this.ensureInitialized();
    await this.databaseManager.clearDatabase();
    console.log("Database cleared");
  }
}

export default new SqlDatabaseService();
