
import { useState, useEffect } from 'react';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';
import { DEFAULT_PART_CATEGORY } from '@/components/parts/category/PartCategoryManager';
import SqlDatabaseService from '@/services/db/SqlDatabaseService';

export function useCategoriesAndUnits() {
  const [units, setUnitsState] = useState<string[]>(["pcs", "kg", "l", "m"]);
  const [machineCategories, setMachineCategoriesState] = useState<string[]>([
    DEFAULT_CATEGORY, "CNC", "Assembly", "Packaging"
  ]);
  const [partCategories, setPartCategoriesState] = useState<string[]>([
    DEFAULT_PART_CATEGORY, "Electronic", "Mechanical", "Plastic"
  ]);
  
  // Load categories and units from localStorage
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        // Ensure SqlDatabaseService is initialized
        await SqlDatabaseService.initialize();
        
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
          }
          setMachineCategoriesState(parsedCategories);
          localStorage.setItem('factory-planner-machine-categories', JSON.stringify(parsedCategories));
        } else {
          // If not found in localStorage, save the default values
          localStorage.setItem('factory-planner-machine-categories', JSON.stringify(machineCategories));
        }
        
        if (savedPartCategories) {
          const parsedPartCategories = JSON.parse(savedPartCategories);
          // Ensure DEFAULT_PART_CATEGORY is always present
          if (!parsedPartCategories.includes(DEFAULT_PART_CATEGORY)) {
            parsedPartCategories.unshift(DEFAULT_PART_CATEGORY);
          }
          setPartCategoriesState(parsedPartCategories);
          localStorage.setItem('factory-planner-part-categories', JSON.stringify(parsedPartCategories));
        } else {
          // If not found in localStorage, save the default values
          localStorage.setItem('factory-planner-part-categories', JSON.stringify(partCategories));
        }
      } catch (storageError) {
        console.error('Error loading categories from localStorage:', storageError);
      }
    };
    
    initializeCategories();
  }, []);
  
  const setUnits = (newUnits: string[]) => {
    setUnitsState(newUnits);
    try {
      localStorage.setItem('factory-planner-units', JSON.stringify(newUnits));
    } catch (error) {
      console.error('Error saving units to localStorage:', error);
    }
  };
  
  const setMachineCategories = (newCategories: string[]) => {
    // Ensure DEFAULT_CATEGORY is always present
    if (!newCategories.includes(DEFAULT_CATEGORY)) {
      newCategories.unshift(DEFAULT_CATEGORY);
    }
    setMachineCategoriesState(newCategories);
    try {
      localStorage.setItem('factory-planner-machine-categories', JSON.stringify(newCategories));
    } catch (error) {
      console.error('Error saving machine categories to localStorage:', error);
    }
  };
  
  const setPartCategories = (newCategories: string[]) => {
    // Ensure DEFAULT_PART_CATEGORY is always present
    if (!newCategories.includes(DEFAULT_PART_CATEGORY)) {
      newCategories.unshift(DEFAULT_PART_CATEGORY);
    }
    setPartCategoriesState(newCategories);
    try {
      localStorage.setItem('factory-planner-part-categories', JSON.stringify(newCategories));
    } catch (error) {
      console.error('Error saving part categories to localStorage:', error);
    }
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
