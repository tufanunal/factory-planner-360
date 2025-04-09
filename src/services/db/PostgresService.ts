import { Pool, QueryResult } from 'pg';
import { dbConfig, poolConfig } from '@/config/database';
import { 
  Machine, 
  Part, 
  Consumable, 
  RawMaterial, 
  CalendarState 
} from '@/types/all';

/**
 * Implementation of database service using PostgreSQL
 */
class PostgresService {
  private pool: Pool;
  private initialized: boolean = false;
  
  constructor() {
    this.pool = new Pool({
      ...dbConfig,
      ...poolConfig
    });
    
    // Log connection errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Test database connection
      const client = await this.pool.connect();
      console.log('Database connection established successfully');
      client.release();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      throw error;
    }
  }
  
  // Generic query execution with error handling
  private async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const result: QueryResult = await this.pool.query(query, params);
      return result.rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
  
  // Machine methods
  async getMachines(): Promise<Machine[]> {
    return this.executeQuery<Machine>('SELECT * FROM machines');
  }
  
  async saveMachine(machine: Machine): Promise<Machine> {
    const query = `
      INSERT INTO machines (id, name, description, status, availability, hourlyCost, labourPersonHour, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        name = $2,
        description = $3,
        status = $4,
        availability = $5,
        hourlyCost = $6,
        labourPersonHour = $7,
        category = $8
      RETURNING *
    `;
    
    const params = [
      machine.id,
      machine.name,
      machine.description || '',  // Handle optional property
      machine.status,
      machine.availability,
      machine.hourlyCost || 0,
      machine.labourPersonHour || 0,
      machine.category || ''
    ];
    
    const results = await this.executeQuery<Machine>(query, params);
    return results[0];
  }
  
  async deleteMachine(id: string): Promise<void> {
    await this.executeQuery('DELETE FROM machines WHERE id = $1', [id]);
  }
  
  // Part methods
  async getParts(): Promise<Part[]> {
    // First get all parts
    const parts = await this.executeQuery<Part>('SELECT * FROM parts');
    
    // For each part, get its consumables and raw materials
    for (const part of parts) {
      // Initialize arrays
      part.consumables = [];
      part.rawMaterials = [];
      
      // Get consumables for this part
      const consumables = await this.executeQuery<any>(
        'SELECT pc.consumable_id as "consumableId", pc.amount FROM part_consumables pc WHERE pc.part_id = $1',
        [part.id]
      );
      part.consumables = consumables;
      
      // Get raw materials for this part
      const rawMaterials = await this.executeQuery<any>(
        'SELECT prm.raw_material_id as "rawMaterialId", prm.amount FROM part_raw_materials prm WHERE prm.part_id = $1',
        [part.id]
      );
      part.rawMaterials = rawMaterials;
    }
    
    return parts;
  }
  
  async savePart(part: Part): Promise<Part> {
    // Start a transaction
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert or update the part - match column names with database structure
      const partQuery = `
        INSERT INTO parts (id, name, description, category, unit, cycle_time, pieces_per_cycle)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = $2,
          description = $3,
          category = $4,
          unit = $5,
          cycle_time = $6,
          pieces_per_cycle = $7
        RETURNING *
      `;
      
      const partParams = [
        part.id,
        part.name,
        part.description || '',
        part.category || 'Default',
        part.unit || '',  // Match database column name
        part.cycleTime || 0,  // Match database column name
        part.piecesPerCycle || 0  // Match database column name
      ];
      
      const partResult = await client.query(partQuery, partParams);
      const savedPart = partResult.rows[0];
      
      // Handle consumables: first delete existing, then add new ones
      await client.query('DELETE FROM part_consumables WHERE part_id = $1', [part.id]);
      
      if (part.consumables && part.consumables.length > 0) {
        for (const consumable of part.consumables) {
          await client.query(
            'INSERT INTO part_consumables (part_id, consumable_id, amount) VALUES ($1, $2, $3)',
            [part.id, consumable.consumableId, consumable.amount]
          );
        }
      }
      
      // Handle raw materials: first delete existing, then add new ones
      await client.query('DELETE FROM part_raw_materials WHERE part_id = $1', [part.id]);
      
      if (part.rawMaterials && part.rawMaterials.length > 0) {
        for (const rawMaterial of part.rawMaterials) {
          await client.query(
            'INSERT INTO part_raw_materials (part_id, raw_material_id, amount) VALUES ($1, $2, $3)',
            [part.id, rawMaterial.rawMaterialId, rawMaterial.amount]
          );
        }
      }
      
      await client.query('COMMIT');
      
      // Now return the saved part with its relationships
      savedPart.consumables = part.consumables || [];
      savedPart.rawMaterials = part.rawMaterials || [];
      
      return savedPart;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in savePart transaction:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  async deletePart(id: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete the part's relationships first
      await client.query('DELETE FROM part_consumables WHERE part_id = $1', [id]);
      await client.query('DELETE FROM part_raw_materials WHERE part_id = $1', [id]);
      
      // Then delete the part itself
      await client.query('DELETE FROM parts WHERE id = $1', [id]);
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in deletePart transaction:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Consumable methods
  async getConsumables(): Promise<Consumable[]> {
    return this.executeQuery<Consumable>('SELECT * FROM consumables');
  }
  
  async saveConsumable(consumable: Consumable): Promise<Consumable> {
    const query = `
      INSERT INTO consumables (id, name, description, unit, unit_cost)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        name = $2,
        description = $3,
        unit = $4,
        unit_cost = $5
      RETURNING *
    `;
    
    const params = [
      consumable.id,
      consumable.name,
      consumable.description || '',  // Handle optional property
      consumable.unit || '',
      consumable.unitCost || consumable.costPerUnit || 0  // Use either property
    ];
    
    const results = await this.executeQuery<Consumable>(query, params);
    return results[0];
  }
  
  async deleteConsumable(id: string): Promise<void> {
    await this.executeQuery('DELETE FROM consumables WHERE id = $1', [id]);
  }
  
  // Raw Material methods
  async getRawMaterials(): Promise<RawMaterial[]> {
    return this.executeQuery<RawMaterial>('SELECT * FROM raw_materials');
  }
  
  async saveRawMaterial(rawMaterial: RawMaterial): Promise<RawMaterial> {
    const query = `
      INSERT INTO raw_materials (id, name, description, unit, unit_cost)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        name = $2,
        description = $3,
        unit = $4,
        unit_cost = $5
      RETURNING *
    `;
    
    const params = [
      rawMaterial.id,
      rawMaterial.name,
      rawMaterial.description || '',  // Handle optional property
      rawMaterial.unit || '',
      rawMaterial.unitCost || rawMaterial.costPerUnit || 0  // Use either property
    ];
    
    const results = await this.executeQuery<RawMaterial>(query, params);
    return results[0];
  }
  
  async deleteRawMaterial(id: string): Promise<void> {
    await this.executeQuery('DELETE FROM raw_materials WHERE id = $1', [id]);
  }
  
  // Calendar methods
  async getCalendarState(): Promise<CalendarState | null> {
    const results = await this.executeQuery<any>('SELECT data FROM calendar_state LIMIT 1');
    return results.length > 0 ? results[0].data : null;
  }
  
  async setCalendarState(calendarState: CalendarState): Promise<void> {
    const query = `
      INSERT INTO calendar_state (id, data)
      VALUES (1, $1)
      ON CONFLICT (id) DO UPDATE SET
        data = $1
    `;
    
    await this.executeQuery(query, [JSON.stringify(calendarState)]);
  }
  
  // Categories and units
  async getCategories(type: 'machine' | 'part'): Promise<string[]> {
    const results = await this.executeQuery<any>('SELECT categories FROM categories WHERE type = $1 LIMIT 1', [type]);
    return results.length > 0 ? results[0].categories : [];
  }
  
  async saveCategories(type: 'machine' | 'part', categories: string[]): Promise<void> {
    const query = `
      INSERT INTO categories (type, categories)
      VALUES ($1, $2)
      ON CONFLICT (type) DO UPDATE SET
        categories = $2
    `;
    
    await this.executeQuery(query, [type, JSON.stringify(categories)]);
  }
  
  async getUnits(): Promise<string[]> {
    const results = await this.executeQuery<any>('SELECT units FROM units LIMIT 1');
    return results.length > 0 ? results[0].units : [];
  }
  
  async saveUnits(units: string[]): Promise<void> {
    const query = `
      INSERT INTO units (id, units)
      VALUES (1, $1)
      ON CONFLICT (id) DO UPDATE SET
        units = $1
    `;
    
    await this.executeQuery(query, [JSON.stringify(units)]);
  }
  
  // For debugging and troubleshooting
  async dumpDatabase(): Promise<any> {
    const tables = ['machines', 'parts', 'consumables', 'raw_materials', 'part_consumables', 'part_raw_materials', 'calendar_state', 'categories', 'units'];
    const result: any = {};
    
    for (const table of tables) {
      try {
        result[table] = await this.executeQuery(`SELECT * FROM ${table}`);
      } catch (error) {
        console.error(`Error dumping table ${table}:`, error);
        result[table] = { error: 'Failed to query table' };
      }
    }
    
    return result;
  }
  
  async clearDatabase(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete data from all tables, preserving structure
      await client.query('DELETE FROM part_consumables');
      await client.query('DELETE FROM part_raw_materials');
      await client.query('DELETE FROM parts');
      await client.query('DELETE FROM machines');
      await client.query('DELETE FROM consumables');
      await client.query('DELETE FROM raw_materials');
      await client.query('DELETE FROM calendar_state');
      await client.query('DELETE FROM categories');
      await client.query('DELETE FROM units');
      
      await client.query('COMMIT');
      console.log('Database cleared successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error clearing database:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new PostgresService();
