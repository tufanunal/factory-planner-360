
import { Consumable, RawMaterial } from '@/types/all';
import SqlDatabaseService from '@/services/db/SqlDatabaseService';

export function useInventoryOperations(
  consumables: Consumable[],
  setConsumables: React.Dispatch<React.SetStateAction<Consumable[]>>,
  rawMaterials: RawMaterial[],
  setRawMaterials: React.Dispatch<React.SetStateAction<RawMaterial[]>>
) {
  // Consumables
  const addConsumable = async (consumable: Consumable) => {
    try {
      await SqlDatabaseService.saveConsumable(consumable);
      setConsumables(prevConsumables => [...prevConsumables, consumable]);
    } catch (error) {
      console.error('Error adding consumable:', error);
    }
  };

  const updateConsumable = async (id: string, consumable: Consumable) => {
    try {
      await SqlDatabaseService.saveConsumable(consumable);
      setConsumables(prevConsumables =>
        prevConsumables.map(c => (c.id === id ? consumable : c))
      );
    } catch (error) {
      console.error('Error updating consumable:', error);
    }
  };

  const removeConsumable = async (id: string) => {
    try {
      await SqlDatabaseService.deleteConsumable(id);
      setConsumables(prevConsumables => prevConsumables.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error removing consumable:', error);
    }
  };
  
  // Raw Materials
  const addRawMaterial = async (rawMaterial: RawMaterial) => {
    try {
      await SqlDatabaseService.saveRawMaterial(rawMaterial);
      setRawMaterials(prevRawMaterials => [...prevRawMaterials, rawMaterial]);
    } catch (error) {
      console.error('Error adding raw material:', error);
    }
  };

  const updateRawMaterial = async (id: string, rawMaterial: RawMaterial) => {
    try {
      await SqlDatabaseService.saveRawMaterial(rawMaterial);
      setRawMaterials(prevRawMaterials =>
        prevRawMaterials.map(rm => (rm.id === id ? rawMaterial : rm))
      );
    } catch (error) {
      console.error('Error updating raw material:', error);
    }
  };

  const removeRawMaterial = async (id: string) => {
    try {
      await SqlDatabaseService.deleteRawMaterial(id);
      setRawMaterials(prevRawMaterials => prevRawMaterials.filter(rm => rm.id !== id));
    } catch (error) {
      console.error('Error removing raw material:', error);
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
