
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Machine } from '@/types/machine';
import { Part } from '@/types/part';
import { Consumable } from '@/types/consumable';
import { RawMaterial } from '@/types/rawMaterial';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';

interface DataContextType {
  // Machines data
  machines: Machine[];
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
  
  // Parts data
  parts: Part[];
  setParts: React.Dispatch<React.SetStateAction<Part[]>>;
  
  // Categories
  machineCategories: string[];
  setMachineCategories: React.Dispatch<React.SetStateAction<string[]>>;
  partCategories: string[];
  setPartCategories: React.Dispatch<React.SetStateAction<string[]>>;

  // Units
  units: string[];
  setUnits: React.Dispatch<React.SetStateAction<string[]>>;

  // Consumables
  consumables: Consumable[];
  setConsumables: React.Dispatch<React.SetStateAction<Consumable[]>>;

  // Raw Materials
  rawMaterials: RawMaterial[];
  setRawMaterials: React.Dispatch<React.SetStateAction<RawMaterial[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_UNITS = ['kg', 'pcs', 'liter', 'meter'];

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Initialize machines state
  const [machines, setMachines] = useState<Machine[]>(() => {
    try {
      const savedMachines = localStorage.getItem('machines');
      return savedMachines ? JSON.parse(savedMachines) : [];
    } catch (error) {
      console.error('Error loading machines from localStorage:', error);
      return [];
    }
  });

  // Initialize parts state - no default data
  const [parts, setParts] = useState<Part[]>(() => {
    try {
      const savedParts = localStorage.getItem('parts');
      return savedParts ? JSON.parse(savedParts) : [];
    } catch (error) {
      console.error('Error loading parts from localStorage:', error);
      return [];
    }
  });

  // Initialize machine categories
  const [machineCategories, setMachineCategories] = useState<string[]>(() => {
    try {
      const savedCategories = localStorage.getItem('machineCategories');
      return savedCategories ? JSON.parse(savedCategories) : [DEFAULT_CATEGORY];
    } catch (error) {
      console.error('Error loading machine categories from localStorage:', error);
      return [DEFAULT_CATEGORY];
    }
  });

  // Initialize part categories
  const [partCategories, setPartCategories] = useState<string[]>(() => {
    try {
      const savedCategories = localStorage.getItem('partCategories');
      return savedCategories ? JSON.parse(savedCategories) : [DEFAULT_CATEGORY];
    } catch (error) {
      console.error('Error loading part categories from localStorage:', error);
      return [DEFAULT_CATEGORY];
    }
  });

  // Initialize units
  const [units, setUnits] = useState<string[]>(() => {
    try {
      const savedUnits = localStorage.getItem('units');
      return savedUnits ? JSON.parse(savedUnits) : DEFAULT_UNITS;
    } catch (error) {
      console.error('Error loading units from localStorage:', error);
      return DEFAULT_UNITS;
    }
  });

  // Initialize consumables
  const [consumables, setConsumables] = useState<Consumable[]>(() => {
    try {
      const savedConsumables = localStorage.getItem('consumables');
      return savedConsumables ? JSON.parse(savedConsumables) : [];
    } catch (error) {
      console.error('Error loading consumables from localStorage:', error);
      return [];
    }
  });

  // Initialize raw materials
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => {
    try {
      const savedRawMaterials = localStorage.getItem('rawMaterials');
      return savedRawMaterials ? JSON.parse(savedRawMaterials) : [];
    } catch (error) {
      console.error('Error loading raw materials from localStorage:', error);
      return [];
    }
  });

  // Ensure localStorage is updated whenever state changes
  useEffect(() => {
    localStorage.setItem('machines', JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem('parts', JSON.stringify(parts));
  }, [parts]);

  useEffect(() => {
    localStorage.setItem('machineCategories', JSON.stringify(machineCategories));
  }, [machineCategories]);

  useEffect(() => {
    localStorage.setItem('partCategories', JSON.stringify(partCategories));
  }, [partCategories]);

  useEffect(() => {
    localStorage.setItem('units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('consumables', JSON.stringify(consumables));
  }, [consumables]);

  useEffect(() => {
    localStorage.setItem('rawMaterials', JSON.stringify(rawMaterials));
  }, [rawMaterials]);

  // When a new machine category is added, ensure it's also available for parts
  useEffect(() => {
    // Sync categories between machines and parts (in case they need to match)
    const combinedCategories = [...new Set([...machineCategories, ...partCategories])];
    
    if (JSON.stringify(combinedCategories) !== JSON.stringify(partCategories)) {
      setPartCategories(combinedCategories);
    }
  }, [machineCategories, partCategories]);

  const value = {
    machines,
    setMachines,
    parts,
    setParts,
    machineCategories,
    setMachineCategories,
    partCategories,
    setPartCategories,
    units,
    setUnits,
    consumables,
    setConsumables,
    rawMaterials,
    setRawMaterials
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
