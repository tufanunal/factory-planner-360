
import { RawMaterial } from '@/types/rawMaterial';
import { generateId } from '@/utils/idGenerator';

export class RawMaterialService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getRawMaterials(): RawMaterial[] {
    return this.db.rawMaterials || [];
  }
  
  saveRawMaterial(material: RawMaterial): RawMaterial {
    const existingIndex = this.db.rawMaterials.findIndex((m: RawMaterial) => m.id === material.id);
    if (existingIndex >= 0) {
      this.db.rawMaterials[existingIndex] = material;
    } else {
      if (!material.id) {
        material.id = generateId();
      }
      this.db.rawMaterials.push(material);
    }
    
    return material;
  }
  
  deleteRawMaterial(id: string): void {
    this.db.rawMaterials = this.db.rawMaterials.filter((m: RawMaterial) => m.id !== id);
  }
}
