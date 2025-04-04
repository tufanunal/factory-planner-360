
import { useState, useEffect } from 'react';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';

export function useCategoriesAndUnits() {
  const [units, setUnitsState] = useState<string[]>(["pcs", "kg", "l", "m"]);
  const [machineCategories, setMachineCategoriesState] = useState<string[]>([
    DEFAULT_CATEGORY, "CNC", "Assembly", "Packaging"
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
      } else {
        // If not found in localStorage, save the default values
        localStorage.setItem('factory-planner-units', JSON.stringify(units));
      }
      
      if (savedMachineCategories) {
        const parsedCategories = JSON.parse(savedMachineCategories);
        // Ensure DEFAULT_CATEGORY is always present
        if (!parsedCategories.includes(DEFAULT_CATEGORY)) {
          parsedCategories.unshift(DEFAULT_CATEGORY);
          localStorage.setItem('factory-planner-machine-categories', JSON.stringify(parsedCategories));
        }
        setMachineCategoriesState(parsedCategories);
      } else {
        // If not found in localStorage, save the default values
        localStorage.setItem('factory-planner-machine-categories', JSON.stringify(machineCategories));
      }
      
      if (savedPartCategories) {
        setPartCategoriesState(JSON.parse(savedPartCategories));
      } else {
        // If not found in localStorage, save the default values
        localStorage.setItem('factory-planner-part-categories', JSON.stringify(partCategories));
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
    // Ensure DEFAULT_CATEGORY is always present
    if (!newCategories.includes(DEFAULT_CATEGORY)) {
      newCategories.unshift(DEFAULT_CATEGORY);
    }
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
