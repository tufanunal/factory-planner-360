
import { PartRawMaterial } from '@/types/partRawMaterial';
import { generateId } from '@/utils/idGenerator';

export class PartRawMaterialService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getPartRawMaterials(): PartRawMaterial[] {
    return this.db.partRawMaterials || [];
  }
  
  savePartRawMaterial(partRawMaterial: PartRawMaterial): PartRawMaterial {
    const existingIndex = this.db.partRawMaterials.findIndex(
      (prm: PartRawMaterial) => prm.partId === partRawMaterial.partId && prm.rawMaterialId === partRawMaterial.rawMaterialId
    );
    
    if (existingIndex >= 0) {
      this.db.partRawMaterials[existingIndex] = partRawMaterial;
    } else {
      if (!partRawMaterial.id) {
        partRawMaterial.id = generateId();
      }
      this.db.partRawMaterials.push(partRawMaterial);
    }
    
    return partRawMaterial;
  }
  
  deletePartRawMaterial(partId: string, rawMaterialId: string): void {
    this.db.partRawMaterials = this.db.partRawMaterials.filter(
      (prm: PartRawMaterial) => !(prm.partId === partId && prm.rawMaterialId === rawMaterialId)
    );
  }
}
