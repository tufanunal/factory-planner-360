
import { Part } from '@/types/part';
import { generateId } from '@/utils/idGenerator';

export class PartService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getParts(): Part[] {
    return this.db.parts || [];
  }
  
  savePart(part: Part): Part {
    const existingIndex = this.db.parts.findIndex((p: Part) => p.id === part.id);
    if (existingIndex >= 0) {
      this.db.parts[existingIndex] = part;
    } else {
      if (!part.id) {
        part.id = generateId();
      }
      this.db.parts.push(part);
    }
    
    return part;
  }
  
  deletePart(id: string): void {
    this.db.parts = this.db.parts.filter((p: Part) => p.id !== id);
  }
}
