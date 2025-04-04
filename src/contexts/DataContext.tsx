
import React, { createContext, useContext } from 'react';
import { 
  Machine, 
  Part, 
  Consumable, 
  RawMaterial, 
  PartConsumable, 
  PartRawMaterial,
  Holiday,
  ShiftTime,
  DayShiftToggle,
  CalendarState
} from '@/types/all';
import { LoadingScreen } from '@/components/ui/loading-spinner';

// Import custom hooks
import { useDataInitialization } from '@/hooks/useDataInitialization';
import { useCategoriesAndUnits } from '@/hooks/useCategoriesAndUnits';
import { useMachineOperations } from '@/hooks/useMachineOperations';
import { usePartOperations } from '@/hooks/usePartOperations';
import { useInventoryOperations } from '@/hooks/useInventoryOperations';
import { useCalendarOperations } from '@/hooks/useCalendarOperations';

interface DataContextType {
  isLoading: boolean;
  machines: Machine[];
  parts: Part[];
  consumables: Consumable[];
  rawMaterials: RawMaterial[];
  partConsumables: PartConsumable[];
  partRawMaterials: PartRawMaterial[];
  calendarState: CalendarState | null;
  
  // Units and categories
  units: string[];
  setUnits: (units: string[]) => void;
  machineCategories: string[];
  setMachineCategories: (categories: string[]) => void;
  partCategories: string[];
  setPartCategories: (categories: string[]) => void;
  
  // Direct state setters (for components that need to modify state)
  setMachines: (machines: Machine[]) => void;
  setParts: (parts: Part[]) => void;
  setConsumables: (consumables: Consumable[]) => void;
  setRawMaterials: (materials: RawMaterial[]) => void;
  
  // Machines
  addMachine: (machine: Machine) => Promise<void>;
  updateMachine: (id: string, machine: Machine) => Promise<void>;
  removeMachine: (id: string) => Promise<void>;
  
  // Parts
  addPart: (part: Part) => Promise<void>;
  updatePart: (id: string, part: Part) => Promise<void>;
  removePart: (id: string) => Promise<void>;
  
  // Consumables
  addConsumable: (consumable: Consumable) => Promise<void>;
  updateConsumable: (id: string, consumable: Consumable) => Promise<void>;
  removeConsumable: (id: string) => Promise<void>;
  
  // Raw Materials
  addRawMaterial: (rawMaterial: RawMaterial) => Promise<void>;
  updateRawMaterial: (id: string, rawMaterial: RawMaterial) => Promise<void>;
  removeRawMaterial: (id: string) => Promise<void>;
  
  // Part Relationships
  addPartConsumable: (relationship: PartConsumable) => Promise<void>;
  removePartConsumable: (partId: string, consumableId: string) => Promise<void>;
  updatePartConsumable: (partId: string, consumableId: string, amount: number) => Promise<void>;
  
  addPartRawMaterial: (relationship: PartRawMaterial) => Promise<void>;
  removePartRawMaterial: (partId: string, rawMaterialId: string) => Promise<void>;
  updatePartRawMaterial: (partId: string, rawMaterialId: string, amount: number) => Promise<void>;

  // Calendar
  addHoliday: (holiday: Holiday) => Promise<void>;
  removeHoliday: (id: string) => Promise<void>;
  addShiftTime: (shiftTime: ShiftTime) => Promise<void>;
  updateShiftTime: (shiftTime: ShiftTime) => Promise<void>;
  removeShiftTime: (id: string) => Promise<void>;
  toggleShift: (date: string, shiftTimeId: string) => Promise<void>;
  setViewDate: (date: string) => Promise<void>;
}

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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize data from database
  const {
    isLoading,
    machines,
    setMachines,
    parts,
    setParts,
    consumables,
    setConsumables,
    rawMaterials,
    setRawMaterials,
    partConsumables,
    setPartConsumables,
    partRawMaterials,
    setPartRawMaterials,
    calendarState,
    setCalendarState
  } = useDataInitialization();
  
  // Initialize categories and units
  const {
    units,
    setUnits,
    machineCategories,
    setMachineCategories,
    partCategories,
    setPartCategories
  } = useCategoriesAndUnits();
  
  // Machine operations
  const { addMachine, updateMachine, removeMachine } = useMachineOperations(machines, setMachines);
  
  // Part operations
  const {
    addPart,
    updatePart,
    removePart,
    addPartConsumable,
    removePartConsumable,
    updatePartConsumable,
    addPartRawMaterial,
    removePartRawMaterial,
    updatePartRawMaterial
  } = usePartOperations(parts, setParts);
  
  // Inventory operations
  const {
    addConsumable,
    updateConsumable,
    removeConsumable,
    addRawMaterial,
    updateRawMaterial,
    removeRawMaterial
  } = useInventoryOperations(consumables, setConsumables, rawMaterials, setRawMaterials);
  
  // Calendar operations
  const {
    addHoliday,
    removeHoliday,
    addShiftTime,
    updateShiftTime,
    removeShiftTime,
    toggleShift,
    setViewDate
  } = useCalendarOperations(calendarState, setCalendarState);
  
  const contextValue: DataContextType = {
    isLoading,
    machines,
    parts,
    consumables,
    rawMaterials,
    partConsumables,
    partRawMaterials,
    calendarState,
    
    units,
    setUnits,
    machineCategories,
    setMachineCategories,
    partCategories,
    setPartCategories,
    
    setMachines,
    setParts,
    setConsumables,
    setRawMaterials,
    
    addMachine,
    updateMachine,
    removeMachine,
    
    addPart,
    updatePart,
    removePart,
    
    addConsumable,
    updateConsumable,
    removeConsumable,
    
    addRawMaterial,
    updateRawMaterial,
    removeRawMaterial,
    
    addPartConsumable,
    removePartConsumable,
    updatePartConsumable,
    
    addPartRawMaterial,
    removePartRawMaterial,
    updatePartRawMaterial,
    
    addHoliday,
    removeHoliday,
    addShiftTime,
    updateShiftTime,
    removeShiftTime,
    toggleShift,
    setViewDate,
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
