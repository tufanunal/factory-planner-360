
import React from 'react';
import { DataContext } from './DataContext';
import { DataContextType } from '@/types/contextTypes';
import { LoadingScreen } from '@/components/ui/loading-spinner';

// Import custom hooks
import { useDataInitialization } from '@/hooks/useDataInitialization';
import { useCategoriesAndUnits } from '@/hooks/useCategoriesAndUnits';
import { useMachineOperations } from '@/hooks/useMachineOperations';
import { usePartOperations } from '@/hooks/usePartOperations';
import { useInventoryOperations } from '@/hooks/useInventoryOperations';
import { useCalendarOperations } from '@/hooks/useCalendarOperations';

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
