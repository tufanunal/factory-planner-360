
import { RawMaterial } from '@/types/rawMaterial';
import { generateId } from '@/utils/idGenerator';

export class RawMaterialService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getRawMaterials(): RawMaterial[] {
    // Ensure rawMaterials array exists
    if (!this.db.rawMaterials) {
      this.db.rawMaterials = [];
    }
    return this.db.rawMaterials;
  }
  
  saveRawMaterial(material: RawMaterial): RawMaterial {
    // Ensure rawMaterials array exists
    if (!this.db.rawMaterials) {
      this.db.rawMaterials = [];
    }
    
    // Validate input material
    if (!material) {
      console.error('Attempted to save null or undefined raw material');
      throw new Error('Invalid raw material data');
    }
    
    // Ensure the material has an ID
    if (!material.id) {
      material.id = generateId();
    }
    
    // Find if material already exists
    const existingIndex = this.db.rawMaterials.findIndex((m: RawMaterial) => m.id === material.id);
    
    if (existingIndex >= 0) {
      // Update existing material
      this.db.rawMaterials[existingIndex] = material;
      console.log(`Updated existing raw material with ID: ${material.id}`);
    } else {
      // Add new material
      this.db.rawMaterials.push(material);
      console.log(`Added new raw material with ID: ${material.id}`);
    }
    
    return material;
  }
  
  deleteRawMaterial(id: string): void {
    if (!this.db.rawMaterials) {
      console.warn('Attempted to delete from empty rawMaterials array');
      return;
    }
    
    const initialLength = this.db.rawMaterials.length;
    this.db.rawMaterials = this.db.rawMaterials.filter((m: RawMaterial) => m.id !== id);
    
    if (this.db.rawMaterials.length === initialLength) {
      console.warn(`No raw material found with ID: ${id}`);
    } else {
      console.log(`Deleted raw material with ID: ${id}`);
    }
  }
}
