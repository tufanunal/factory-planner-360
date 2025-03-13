
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Machine } from '@/types/machine';
import { Part } from '@/types/part';
import { Consumable } from '@/types/consumable';
import { RawMaterial } from '@/types/rawMaterial';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';
import db from '@/services/db/DatabaseService';
import { toast } from 'sonner';

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
  
  // Database status
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_UNITS = ['kg', 'pcs', 'liter', 'meter'];

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Database loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize machines state
  const [machines, setMachines] = useState<Machine[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [machineCategories, setMachineCategories] = useState<string[]>([DEFAULT_CATEGORY]);
  const [partCategories, setPartCategories] = useState<string[]>([DEFAULT_CATEGORY]);
  const [units, setUnits] = useState<string[]>(DEFAULT_UNITS);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);

  // Initialize database and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize the database
        await db.init();
        
        // Load machines
        const dbMachines = await db.getMachines();
        setMachines(dbMachines.length > 0 ? dbMachines : []);
        
        // Load parts
        const dbParts = await db.getParts();
        setParts(dbParts.length > 0 ? dbParts : []);
        
        // Load machine categories
        const dbMachineCategories = await db.getCategories('machine');
        setMachineCategories(dbMachineCategories.length > 0 ? dbMachineCategories : [DEFAULT_CATEGORY]);
        
        // Load part categories
        const dbPartCategories = await db.getCategories('part');
        setPartCategories(dbPartCategories.length > 0 ? dbPartCategories : [DEFAULT_CATEGORY]);
        
        // Load units
        const dbUnits = await db.getUnits();
        setUnits(dbUnits.length > 0 ? dbUnits : DEFAULT_UNITS);
        
        // Load consumables
        const dbConsumables = await db.getConsumables();
        setConsumables(dbConsumables.length > 0 ? dbConsumables : []);
        
        // Load raw materials
        const dbRawMaterials = await db.getRawMaterials();
        setRawMaterials(dbRawMaterials.length > 0 ? dbRawMaterials : []);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Failed to load data');
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // Save machines to the database when they change
  useEffect(() => {
    if (!isLoading && machines.length > 0) {
      const saveMachines = async () => {
        try {
          await db.saveItems('machines', machines);
        } catch (error) {
          console.error('Error saving machines:', error);
          toast.error('Failed to save machines');
        }
      };
      saveMachines();
    }
  }, [machines, isLoading]);

  // Save parts to the database
  useEffect(() => {
    if (!isLoading && parts.length > 0) {
      const saveParts = async () => {
        try {
          await db.saveItems('parts', parts);
        } catch (error) {
          console.error('Error saving parts:', error);
          toast.error('Failed to save parts');
        }
      };
      saveParts();
    }
  }, [parts, isLoading]);

  // Save machine categories
  useEffect(() => {
    if (!isLoading) {
      const saveCategories = async () => {
        try {
          await db.saveCategories('machine', machineCategories);
        } catch (error) {
          console.error('Error saving machine categories:', error);
        }
      };
      saveCategories();
    }
  }, [machineCategories, isLoading]);

  // Save part categories
  useEffect(() => {
    if (!isLoading) {
      const saveCategories = async () => {
        try {
          await db.saveCategories('part', partCategories);
        } catch (error) {
          console.error('Error saving part categories:', error);
        }
      };
      saveCategories();
    }
  }, [partCategories, isLoading]);

  // Save units
  useEffect(() => {
    if (!isLoading) {
      const saveUnits = async () => {
        try {
          await db.saveUnits(units);
        } catch (error) {
          console.error('Error saving units:', error);
        }
      };
      saveUnits();
    }
  }, [units, isLoading]);

  // Save consumables
  useEffect(() => {
    if (!isLoading && consumables.length > 0) {
      const saveConsumables = async () => {
        try {
          await db.saveItems('consumables', consumables);
        } catch (error) {
          console.error('Error saving consumables:', error);
          toast.error('Failed to save consumables');
        }
      };
      saveConsumables();
    }
  }, [consumables, isLoading]);

  // Save raw materials
  useEffect(() => {
    if (!isLoading && rawMaterials.length > 0) {
      const saveRawMaterials = async () => {
        try {
          await db.saveItems('rawMaterials', rawMaterials);
        } catch (error) {
          console.error('Error saving raw materials:', error);
          toast.error('Failed to save raw materials');
        }
      };
      saveRawMaterials();
    }
  }, [rawMaterials, isLoading]);

  // When a new machine category is added, ensure it's also available for parts
  useEffect(() => {
    if (!isLoading) {
      // Sync categories between machines and parts (in case they need to match)
      const combinedCategories = [...new Set([...machineCategories, ...partCategories])];
      
      if (JSON.stringify(combinedCategories) !== JSON.stringify(partCategories)) {
        setPartCategories(combinedCategories);
      }
    }
  }, [machineCategories, partCategories, isLoading]);

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
    setRawMaterials,
    isLoading
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
