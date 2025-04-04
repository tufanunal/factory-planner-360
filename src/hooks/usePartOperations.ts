
import { Part, PartConsumable, PartRawMaterial } from '@/types/all';
import SqlDatabaseService from '@/services/db/SqlDatabaseService';

export function usePartOperations(
  parts: Part[],
  setParts: React.Dispatch<React.SetStateAction<Part[]>>
) {
  // Part CRUD
  const addPart = async (part: Part) => {
    try {
      await SqlDatabaseService.savePart(part);
      setParts(prevParts => [...prevParts, part]);
    } catch (error) {
      console.error('Error adding part:', error);
    }
  };

  const updatePart = async (id: string, part: Part) => {
    try {
      await SqlDatabaseService.savePart(part);
      setParts(prevParts =>
        prevParts.map(p => (p.id === id ? part : p))
      );
    } catch (error) {
      console.error('Error updating part:', error);
    }
  };

  const removePart = async (id: string) => {
    try {
      await SqlDatabaseService.deletePart(id);
      setParts(prevParts => prevParts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error removing part:', error);
    }
  };
  
  // Part relationships
  const addPartConsumable = async (relationship: PartConsumable) => {
    try {
      const part = parts.find(p => p.id === relationship.partId);
      if (part) {
        const updatedPart = {
          ...part,
          consumables: [
            ...part.consumables,
            {
              consumableId: relationship.consumableId,
              amount: relationship.amount
            }
          ]
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === part.id ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error adding part consumable:', error);
    }
  };

  const removePartConsumable = async (partId: string, consumableId: string) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const updatedPart = {
          ...part,
          consumables: part.consumables.filter(c => c.consumableId !== consumableId)
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error removing part consumable:', error);
    }
  };

  const updatePartConsumable = async (partId: string, consumableId: string, amount: number) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const updatedPart = {
          ...part,
          consumables: part.consumables.map(c => {
            if (c.consumableId === consumableId) {
              return { ...c, amount };
            }
            return c;
          })
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error updating part consumable:', error);
    }
  };

  const addPartRawMaterial = async (relationship: PartRawMaterial) => {
    try {
      const part = parts.find(p => p.id === relationship.partId);
      if (part) {
        const updatedPart = {
          ...part,
          rawMaterials: [
            ...part.rawMaterials,
            {
              rawMaterialId: relationship.rawMaterialId,
              amount: relationship.amount
            }
          ]
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === part.id ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error adding part raw material:', error);
    }
  };

  const removePartRawMaterial = async (partId: string, rawMaterialId: string) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const updatedPart = {
          ...part,
          rawMaterials: part.rawMaterials.filter(r => r.rawMaterialId !== rawMaterialId)
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error removing part raw material:', error);
    }
  };

  const updatePartRawMaterial = async (partId: string, rawMaterialId: string, amount: number) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const updatedPart = {
          ...part,
          rawMaterials: part.rawMaterials.map(r => {
            if (r.rawMaterialId === rawMaterialId) {
              return { ...r, amount };
            }
            return r;
          })
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error updating part raw material:', error);
    }
  };
  
  return {
    addPart,
    updatePart,
    removePart,
    addPartConsumable,
    removePartConsumable,
    updatePartConsumable,
    addPartRawMaterial,
    removePartRawMaterial,
    updatePartRawMaterial
  };
}
