
import { useState, useEffect } from 'react';

export function useCategoriesAndUnits() {
  const [units, setUnitsState] = useState<string[]>(["pcs", "kg", "l", "m"]);
  const [machineCategories, setMachineCategoriesState] = useState<string[]>([
    "Uncategorized", "CNC", "Assembly", "Packaging"
  ]);
  const [partCategories, setPartCategoriesState] = useState<string[]>([
    "Uncategorized", "Electronic", "Mechanical", "Plastic"
  ]);
  
  // Load categories and units from localStorage
  useEffect(() => {
    try {
      const savedUnits = localStorage.getItem('factory-planner-units');
      const savedMachineCategories = localStorage.getItem('factory-planner-machine-categories');
      const savedPartCategories = localStorage.getItem('factory-planner-part-categories');
      
      if (savedUnits) {
        setUnitsState(JSON.parse(savedUnits));
      }
      
      if (savedMachineCategories) {
        setMachineCategoriesState(JSON.parse(savedMachineCategories));
      }
      
      if (savedPartCategories) {
        setPartCategoriesState(JSON.parse(savedPartCategories));
      }
    } catch (storageError) {
      console.error('Error loading categories from localStorage:', storageError);
    }
  }, []);
  
  const setUnits = (newUnits: string[]) => {
    setUnitsState(newUnits);
    localStorage.setItem('factory-planner-units', JSON.stringify(newUnits));
  };
  
  const setMachineCategories = (newCategories: string[]) => {
    setMachineCategoriesState(newCategories);
    localStorage.setItem('factory-planner-machine-categories', JSON.stringify(newCategories));
  };
  
  const setPartCategories = (newCategories: string[]) => {
    setPartCategoriesState(newCategories);
    localStorage.setItem('factory-planner-part-categories', JSON.stringify(newCategories));
  };
  
  return {
    units,
    setUnits,
    machineCategories,
    setMachineCategories,
    partCategories,
    setPartCategories
  };
}
