
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Machine } from '@/types/machine';
import { Part } from '@/types/part';
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

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

  // Initialize parts state
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

  // Save machines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('machines', JSON.stringify(machines));
  }, [machines]);

  // Save parts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('parts', JSON.stringify(parts));
  }, [parts]);

  // Save machine categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('machineCategories', JSON.stringify(machineCategories));
  }, [machineCategories]);

  // Save part categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('partCategories', JSON.stringify(partCategories));
  }, [partCategories]);

  const value = {
    machines,
    setMachines,
    parts,
    setParts,
    machineCategories,
    setMachineCategories,
    partCategories,
    setPartCategories
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
