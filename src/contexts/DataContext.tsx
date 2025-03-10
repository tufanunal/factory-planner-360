
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

// Initial default data for parts
const DEFAULT_PARTS: Part[] = [
  { 
    id: 1, 
    sku: 'P-1001', 
    name: 'Aluminum Frame',
    category: 'Structural',
    qualityRate: 99.7,
    stock: 152,
    status: 'Active',
    consumables: [],
    rawMaterials: []
  },
  { 
    id: 2, 
    sku: 'P-1002', 
    name: 'Steel Bearing',
    category: 'Mechanical',
    qualityRate: 99.9,
    stock: 543,
    status: 'Active',
    consumables: [],
    rawMaterials: []
  },
  { 
    id: 3, 
    sku: 'P-1003', 
    name: 'Circuit Board',
    category: 'Electronic',
    qualityRate: 98.5,
    stock: 28,
    status: 'Low Stock',
    consumables: [],
    rawMaterials: []
  },
  { 
    id: 4, 
    sku: 'P-1004', 
    name: 'Plastic Housing',
    category: 'Enclosures',
    qualityRate: 99.2,
    stock: 205,
    status: 'Active',
    consumables: [],
    rawMaterials: []
  },
  { 
    id: 5, 
    sku: 'P-1005', 
    name: 'Power Supply',
    category: 'Electronic',
    qualityRate: 99.0,
    stock: 15,
    status: 'Low Stock',
    consumables: [],
    rawMaterials: []
  },
  { 
    id: 6, 
    sku: 'P-1006', 
    name: 'Control Panel',
    category: 'Interface',
    qualityRate: 99.8,
    stock: 0,
    status: 'Discontinued',
    consumables: [],
    rawMaterials: []
  },
];

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

  // Initialize parts state with default data
  const [parts, setParts] = useState<Part[]>(() => {
    try {
      const savedParts = localStorage.getItem('parts');
      return savedParts ? JSON.parse(savedParts) : DEFAULT_PARTS;
    } catch (error) {
      console.error('Error loading parts from localStorage:', error);
      return DEFAULT_PARTS;
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

  // Initialize localStorage with default values if not already set
  useEffect(() => {
    if (!localStorage.getItem('parts')) {
      localStorage.setItem('parts', JSON.stringify(DEFAULT_PARTS));
    }
    
    if (!localStorage.getItem('units')) {
      localStorage.setItem('units', JSON.stringify(DEFAULT_UNITS));
    }
    
    if (!localStorage.getItem('machineCategories') && machineCategories.length > 0) {
      localStorage.setItem('machineCategories', JSON.stringify(machineCategories));
    }
    
    if (!localStorage.getItem('partCategories') && partCategories.length > 0) {
      localStorage.setItem('partCategories', JSON.stringify(partCategories));
    }
  }, []);

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
