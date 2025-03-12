import React, { createContext, useContext, useState, useEffect } from 'react';
import { Machine } from '@/types/machine';
import { Part } from '@/types/part';
import { Consumable } from '@/types/consumable';
import { RawMaterial } from '@/types/rawMaterial';
import { Calendar, Shift, Holiday, WorkdaysPattern } from '@/types/calendar';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';

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

  // Initialize shifts
  const [shifts, setShifts] = useState<Shift[]>(() => {
    try {
      const savedShifts = localStorage.getItem('shifts');
      return savedShifts ? JSON.parse(savedShifts) : DEFAULT_SHIFTS;
    } catch (error) {
      console.error('Error loading shifts from localStorage:', error);
      return DEFAULT_SHIFTS;
    }
  });

  // Initialize calendars
  const [calendars, setCalendars] = useState<Calendar[]>(() => {
    try {
      const savedCalendars = localStorage.getItem('calendars');
      const parsedCalendars = savedCalendars ? JSON.parse(savedCalendars) : [DEFAULT_CALENDAR];
      
      // Convert date strings back to Date objects
      return parsedCalendars.map((calendar: any) => ({
        ...calendar,
        holidays: calendar.holidays.map((holiday: any) => ({
          ...holiday,
          date: new Date(holiday.date)
        }))
      }));
    } catch (error) {
      console.error('Error loading calendars from localStorage:', error);
      return [DEFAULT_CALENDAR];
    }
  });

  // Active calendar ID
  const [activeCalendarId, setActiveCalendarId] = useState<string>(() => {
    try {
      const savedActiveCalendarId = localStorage.getItem('activeCalendarId');
      return savedActiveCalendarId || 'default';
    } catch (error) {
      console.error('Error loading active calendar ID from localStorage:', error);
      return 'default';
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

  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('calendars', JSON.stringify(calendars));
  }, [calendars]);

  useEffect(() => {
    localStorage.setItem('activeCalendarId', activeCalendarId);
  }, [activeCalendarId]);

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
    setRawMaterials,
    shifts,
    setShifts,
    calendars,
    setCalendars,
    activeCalendarId,
    setActiveCalendarId
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
