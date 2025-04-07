
import { Part } from '@/types/part';
import { generateId } from '@/utils/idGenerator';
import { DEFAULT_PART_CATEGORY } from '@/components/parts/PartCategoryManager';

export class PartService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getParts(): Part[] {
    return this.db.parts || [];
  }
  
  savePart(part: Part): Part {
    if (!this.db.parts) {
      this.db.parts = [];
    }
    
    const existingIndex = this.db.parts.findIndex((p: Part) => p.id === part.id);
    
    // Ensure part has a category, defaulting to DEFAULT_PART_CATEGORY if not specified
    if (!part.category) {
      part.category = DEFAULT_PART_CATEGORY;
    }
    
    // Ensure part has consumables and rawMaterials arrays
    if (!part.consumables) {
      part.consumables = [];
    }
    
    if (!part.rawMaterials) {
      part.rawMaterials = [];
    }
    
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
    if (this.db.parts) {
      this.db.parts = this.db.parts.filter((p: Part) => p.id !== id);
    }
  }
  
  // Update part categories if the category is changed
  updatePartCategories(oldCategory: string, newCategory: string): void {
    if (this.db.parts && oldCategory !== newCategory) {
      this.db.parts = this.db.parts.map((p: Part) => {
        if (p.category === oldCategory) {
          return { ...p, category: newCategory };
        }
        return p;
      });
    }
  }

  // Update part categories when a category is deleted
  revertCategoryToDefault(categoryToDelete: string): number {
    let count = 0;
    if (this.db.parts) {
      this.db.parts = this.db.parts.map((p: Part) => {
        if (p.category === categoryToDelete) {
          count++;
          return { ...p, category: DEFAULT_PART_CATEGORY };
        }
        return p;
      });
    }
    return count;
  }
}
