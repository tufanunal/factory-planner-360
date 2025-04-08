
import { createContext, useContext } from 'react';
import { DataContextType } from '@/types/contextTypes';

// Create context with default values
const DataContext = createContext<DataContextType>({
  isLoading: true,
  machines: [],
  parts: [],
  consumables: [],
  rawMaterials: [],
  partConsumables: [],
  partRawMaterials: [],
  calendarState: null,
  
  // Units and categories
  units: [],
  setUnits: () => {},
  machineCategories: [],
  setMachineCategories: () => {},
  partCategories: [],
  setPartCategories: () => {},
  
  // Direct state setters
  setMachines: () => {},
  setParts: () => {},
  setConsumables: () => {},
  setRawMaterials: () => {},
  
  addMachine: async () => {},
  updateMachine: async () => {},
  removeMachine: async () => {},
  
  addPart: async () => {},
  updatePart: async () => {},
  removePart: async () => {},
  
  addConsumable: async () => {},
  updateConsumable: async () => {},
  removeConsumable: async () => {},
  
  addRawMaterial: async () => {},
  updateRawMaterial: async () => {},
  removeRawMaterial: async () => {},
  
  addPartConsumable: async () => {},
  removePartConsumable: async () => {},
  updatePartConsumable: async () => {},
  
  addPartRawMaterial: async () => {},
  removePartRawMaterial: async () => {},
  updatePartRawMaterial: async () => {},
  
  addHoliday: async () => {},
  removeHoliday: async () => {},
  addShiftTime: async () => {},
  updateShiftTime: async () => {},
  removeShiftTime: async () => {},
  toggleShift: async () => {},
  setViewDate: async () => {},
});

// Export the useData hook
const useData = () => useContext(DataContext);

export { DataContext, useData };
export { DataProvider } from './DataContextProvider';
