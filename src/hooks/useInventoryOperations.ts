
import { Consumable, RawMaterial } from '@/types/all';
import SqlDatabaseService from '@/services/db/SqlDatabaseService';
import { generateId } from '@/utils/idGenerator';

export function useInventoryOperations(
  consumables: Consumable[],
  setConsumables: React.Dispatch<React.SetStateAction<Consumable[]>>,
  rawMaterials: RawMaterial[],
  setRawMaterials: React.Dispatch<React.SetStateAction<RawMaterial[]>>
) {
  // Consumables
  const addConsumable = async (consumable: Consumable): Promise<void> => {
    try {
      if (!consumable.id) {
        consumable.id = generateId();
      }
      
      // Save to database first
      const savedConsumable = await SqlDatabaseService.saveConsumable(consumable);
      console.log("Consumable saved to database:", savedConsumable);
      
      // Then update state
      setConsumables(prevConsumables => [...prevConsumables, savedConsumable]);
    } catch (error) {
      console.error('Error adding consumable:', error);
      throw error;
    }
  };

  const updateConsumable = async (id: string, consumable: Consumable): Promise<void> => {
    try {
      // Save to database first
      const updatedConsumable = await SqlDatabaseService.saveConsumable(consumable);
      console.log("Consumable updated in database:", updatedConsumable);
      
      // Then update state
      setConsumables(prevConsumables =>
        prevConsumables.map(c => (c.id === id ? updatedConsumable : c))
      );
    } catch (error) {
      console.error('Error updating consumable:', error);
      throw error;
    }
  };

  const removeConsumable = async (id: string): Promise<void> => {
    try {
      // Delete from database first
      await SqlDatabaseService.deleteConsumable(id);
      console.log("Consumable removed from database:", id);
      
      // Then update state
      setConsumables(prevConsumables => prevConsumables.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error removing consumable:', error);
      throw error;
    }
  };
  
  // Raw Materials
  const addRawMaterial = async (rawMaterial: RawMaterial): Promise<void> => {
    try {
      // Ensure the material has an ID
      if (!rawMaterial.id) {
        rawMaterial.id = generateId();
        console.log("Generated ID for new raw material:", rawMaterial.id);
      }
      
      // Save to database first
      const savedMaterial = await SqlDatabaseService.saveRawMaterial(rawMaterial);
      console.log("Raw material saved to database:", savedMaterial);
      
      // Then update the state
      setRawMaterials(prevRawMaterials => [...prevRawMaterials, savedMaterial]);
    } catch (error) {
      console.error('Error adding raw material:', error);
      throw error;
    }
  };

  const updateRawMaterial = async (id: string, rawMaterial: RawMaterial): Promise<void> => {
    try {
      // Ensure ID is set correctly
      rawMaterial.id = id;
      
      // Save to database first
      const updatedMaterial = await SqlDatabaseService.saveRawMaterial(rawMaterial);
      console.log("Raw material updated in database:", updatedMaterial);
      
      // Then update the state
      setRawMaterials(prevRawMaterials =>
        prevRawMaterials.map(rm => (rm.id === id ? updatedMaterial : rm))
      );
    } catch (error) {
      console.error('Error updating raw material:', error);
      throw error;
    }
  };

  const removeRawMaterial = async (id: string): Promise<void> => {
    try {
      // Delete from database first
      await SqlDatabaseService.deleteRawMaterial(id);
      console.log("Raw material removed from database:", id);
      
      // Then update the state
      setRawMaterials(prevRawMaterials => prevRawMaterials.filter(rm => rm.id !== id));
    } catch (error) {
      console.error('Error removing raw material:', error);
      throw error;
    }
  };
  
  return {
    addConsumable,
    updateConsumable,
    removeConsumable,
    addRawMaterial,
    updateRawMaterial,
    removeRawMaterial
  };
}
