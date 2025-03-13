
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Machine } from '@/types/machine';
import { Part } from '@/types/part';
import { Consumable } from '@/types/consumable';
import { RawMaterial } from '@/types/rawMaterial';
import { Calendar, Shift, Holiday, WorkdaysPattern } from '@/types/calendar';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';
import db from '@/services/db/DatabaseService';
import { toast } from 'sonner';

// Default workdays pattern (Mon-Fri)
export const DEFAULT_WORKDAYS_PATTERN: WorkdaysPattern = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};

// Default shifts
export const DEFAULT_SHIFTS: Shift[] = [
  { id: 1, name: 'Morning Shift', startTime: '06:00', endTime: '14:00', team: 'Team A', color: 'bg-blue-100 text-blue-600' },
  { id: 2, name: 'Afternoon Shift', startTime: '14:00', endTime: '22:00', team: 'Team B', color: 'bg-green-100 text-green-600' },
  { id: 3, name: 'Night Shift', startTime: '22:00', endTime: '06:00', team: 'Team C', color: 'bg-purple-100 text-purple-600' },
];

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
  
  // Calendar data
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  calendars: Calendar[];
  setCalendars: React.Dispatch<React.SetStateAction<Calendar[]>>;
  activeCalendarId: string;
  setActiveCalendarId: React.Dispatch<React.SetStateAction<string>>;
  
  // Database status
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_UNITS = ['kg', 'pcs', 'liter', 'meter'];

// Default calendar for the system
const DEFAULT_CALENDAR: Calendar = {
  id: 'default',
  name: 'Default Calendar',
  countryCode: 'INT',
  isDefault: true,
  holidays: [
    { id: 1, name: 'New Year\'s Day', date: new Date(new Date().getFullYear(), 0, 1) },
    { id: 2, name: 'Labor Day', date: new Date(new Date().getFullYear(), 4, 1) },
    { id: 3, name: 'Christmas', date: new Date(new Date().getFullYear(), 11, 25) },
  ],
  workdaysPattern: DEFAULT_WORKDAYS_PATTERN,
};

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
  const [shifts, setShifts] = useState<Shift[]>(DEFAULT_SHIFTS);
  const [calendars, setCalendars] = useState<Calendar[]>([DEFAULT_CALENDAR]);
  const [activeCalendarId, setActiveCalendarId] = useState<string>('default');

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
        
        // Load shifts
        const dbShifts = await db.getShifts();
        setShifts(dbShifts.length > 0 ? dbShifts : DEFAULT_SHIFTS);
        
        // Load calendars
        const dbCalendars = await db.getCalendars();
        setCalendars(dbCalendars.length > 0 ? dbCalendars : [DEFAULT_CALENDAR]);
        
        // Load active calendar ID
        const dbActiveCalendarId = await db.getSetting('activeCalendarId');
        setActiveCalendarId(dbActiveCalendarId || 'default');
        
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

  // Save shifts
  useEffect(() => {
    if (!isLoading && shifts.length > 0) {
      const saveShifts = async () => {
        try {
          await db.saveItems('shifts', shifts);
        } catch (error) {
          console.error('Error saving shifts:', error);
          toast.error('Failed to save shifts');
        }
      };
      saveShifts();
    }
  }, [shifts, isLoading]);

  // Save calendars
  useEffect(() => {
    if (!isLoading && calendars.length > 0) {
      const saveCalendars = async () => {
        try {
          await db.saveItems('calendars', calendars);
        } catch (error) {
          console.error('Error saving calendars:', error);
          toast.error('Failed to save calendars');
        }
      };
      saveCalendars();
    }
  }, [calendars, isLoading]);

  // Save active calendar ID
  useEffect(() => {
    if (!isLoading) {
      const saveActiveCalendarId = async () => {
        try {
          await db.saveSetting('activeCalendarId', activeCalendarId);
        } catch (error) {
          console.error('Error saving active calendar ID:', error);
        }
      };
      saveActiveCalendarId();
    }
  }, [activeCalendarId, isLoading]);

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
    shifts,
    setShifts,
    calendars,
    setCalendars,
    activeCalendarId,
    setActiveCalendarId,
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
