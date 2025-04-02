import React, { createContext, useContext, useState, useEffect } from 'react';
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
import SqlDatabaseService from '@/services/db/SqlDatabaseService';

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
  removeShiftTime: (id: string) => Promise<void>;
  toggleShift: (date: string, shiftTimeId: string) => Promise<void>;
  setViewDate: (date: string) => Promise<void>;
}

// Create context with initial empty values
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

  // Calendar
  addHoliday: async () => {},
  removeHoliday: async () => {},
  addShiftTime: async () => {},
  removeShiftTime: async () => {},
  toggleShift: async () => {},
  setViewDate: async () => {},
});

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for each data type
  const [isLoading, setIsLoading] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [partConsumables, setPartConsumables] = useState<PartConsumable[]>([]);
  const [partRawMaterials, setPartRawMaterials] = useState<PartRawMaterial[]>([]);
  const [calendarState, setCalendarState] = useState<CalendarState | null>(null);
  
  // Units and categories
  const [units, setUnits] = useState<string[]>(["pcs", "kg", "l", "m"]);
  const [machineCategories, setMachineCategories] = useState<string[]>(["Uncategorized", "CNC", "Assembly", "Packaging"]);
  const [partCategories, setPartCategories] = useState<string[]>(["Uncategorized", "Electronic", "Mechanical", "Plastic"]);
  
  // Initialize database and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initialize the database
        await SqlDatabaseService.initialize();
        
        // Load initial data
        const loadedMachines = await SqlDatabaseService.getMachines();
        const loadedParts = await SqlDatabaseService.getParts();
        const loadedConsumables = await SqlDatabaseService.getConsumables();
        const loadedRawMaterials = await SqlDatabaseService.getRawMaterials();
        const loadedCalendarState = await SqlDatabaseService.getCalendarState();
        
        // Update state
        setMachines(loadedMachines || []);
        setParts(loadedParts || []);
        setConsumables(loadedConsumables || []);
        setRawMaterials(loadedRawMaterials || []);
        
        // Initialize calendar state if not exists
        if (!loadedCalendarState) {
          const initialCalendarState: CalendarState = {
            shiftTimes: [
              {
                id: '1',
                name: 'Morning',
                startTime: '06:00',
                endTime: '14:00',
                color: 'blue'
              },
              {
                id: '2',
                name: 'Afternoon',
                startTime: '14:00',
                endTime: '22:00',
                color: 'green'
              },
              {
                id: '3',
                name: 'Night',
                startTime: '22:00',
                endTime: '06:00',
                color: 'purple'
              }
            ],
            dayShiftToggles: [],
            holidays: [],
            viewDate: new Date().toISOString().split('T')[0]
          };
          
          await SqlDatabaseService.setCalendarState(initialCalendarState);
          setCalendarState(initialCalendarState);
        } else {
          setCalendarState(loadedCalendarState);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);
  
  // Machine methods
  const addMachine = async (machine: Machine) => {
    try {
      await SqlDatabaseService.saveMachine(machine);
      setMachines(prevMachines => [...prevMachines, machine]);
    } catch (error) {
      console.error('Error adding machine:', error);
    }
  };

  const updateMachine = async (id: string, machine: Machine) => {
    try {
      await SqlDatabaseService.saveMachine(machine);
      setMachines(prevMachines =>
        prevMachines.map(m => (m.id === id ? machine : m))
      );
    } catch (error) {
      console.error('Error updating machine:', error);
    }
  };

  const removeMachine = async (id: string) => {
    try {
      await SqlDatabaseService.deleteMachine(id);
      setMachines(prevMachines => prevMachines.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error removing machine:', error);
    }
  };
  
  // Part methods
  const addPart = async (part: Part) => {
    try {
      await SqlDatabaseService.savePart(part);
      setParts(prevParts => [...prevParts, part]);
    } catch (error) {
      console.error('Error adding part:', error);
    }
  };

  const updatePart = async (id: string, part: Part) => {
    try {
      await SqlDatabaseService.savePart(part);
      setParts(prevParts =>
        prevParts.map(p => (p.id === id ? part : p))
      );
    } catch (error) {
      console.error('Error updating part:', error);
    }
  };

  const removePart = async (id: string) => {
    try {
      await SqlDatabaseService.deletePart(id);
      setParts(prevParts => prevParts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error removing part:', error);
    }
  };
  
  // Consumable methods
  const addConsumable = async (consumable: Consumable) => {
    try {
      await SqlDatabaseService.saveConsumable(consumable);
      setConsumables(prevConsumables => [...prevConsumables, consumable]);
    } catch (error) {
      console.error('Error adding consumable:', error);
    }
  };

  const updateConsumable = async (id: string, consumable: Consumable) => {
    try {
      await SqlDatabaseService.saveConsumable(consumable);
      setConsumables(prevConsumables =>
        prevConsumables.map(c => (c.id === id ? consumable : c))
      );
    } catch (error) {
      console.error('Error updating consumable:', error);
    }
  };

  const removeConsumable = async (id: string) => {
    try {
      await SqlDatabaseService.deleteConsumable(id);
      setConsumables(prevConsumables => prevConsumables.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error removing consumable:', error);
    }
  };
  
  // Raw Material methods
  const addRawMaterial = async (rawMaterial: RawMaterial) => {
    try {
      await SqlDatabaseService.saveRawMaterial(rawMaterial);
      setRawMaterials(prevRawMaterials => [...prevRawMaterials, rawMaterial]);
    } catch (error) {
      console.error('Error adding raw material:', error);
    }
  };

  const updateRawMaterial = async (id: string, rawMaterial: RawMaterial) => {
    try {
      await SqlDatabaseService.saveRawMaterial(rawMaterial);
      setRawMaterials(prevRawMaterials =>
        prevRawMaterials.map(rm => (rm.id === id ? rawMaterial : rm))
      );
    } catch (error) {
      console.error('Error updating raw material:', error);
    }
  };

  const removeRawMaterial = async (id: string) => {
    try {
      await SqlDatabaseService.deleteRawMaterial(id);
      setRawMaterials(prevRawMaterials => prevRawMaterials.filter(rm => rm.id !== id));
    } catch (error) {
      console.error('Error removing raw material:', error);
    }
  };
  
  // Part Relationships methods
  const addPartConsumable = async (relationship: PartConsumable) => {
    try {
      const part = parts.find(p => p.id === relationship.partId);
      if (part) {
        const updatedPart = {
          ...part,
          consumables: [
            ...part.consumables,
            {
              consumableId: relationship.consumableId,
              amount: relationship.amount
            }
          ]
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === part.id ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error adding part consumable:', error);
    }
  };

  const removePartConsumable = async (partId: string, consumableId: string) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const updatedPart = {
          ...part,
          consumables: part.consumables.filter(c => c.consumableId !== consumableId)
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error removing part consumable:', error);
    }
  };

  const updatePartConsumable = async (partId: string, consumableId: string, amount: number) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const updatedPart = {
          ...part,
          consumables: part.consumables.map(c => {
            if (c.consumableId === consumableId) {
              return { ...c, amount };
            }
            return c;
          })
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error updating part consumable:', error);
    }
  };

  const addPartRawMaterial = async (relationship: PartRawMaterial) => {
    try {
      const part = parts.find(p => p.id === relationship.partId);
      if (part) {
        const updatedPart = {
          ...part,
          rawMaterials: [
            ...part.rawMaterials,
            {
              rawMaterialId: relationship.rawMaterialId,
              amount: relationship.amount
            }
          ]
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === part.id ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error adding part raw material:', error);
    }
  };

  const removePartRawMaterial = async (partId: string, rawMaterialId: string) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const updatedPart = {
          ...part,
          rawMaterials: part.rawMaterials.filter(r => r.rawMaterialId !== rawMaterialId)
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error removing part raw material:', error);
    }
  };

  const updatePartRawMaterial = async (partId: string, rawMaterialId: string, amount: number) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        const updatedPart = {
          ...part,
          rawMaterials: part.rawMaterials.map(r => {
            if (r.rawMaterialId === rawMaterialId) {
              return { ...r, amount };
            }
            return r;
          })
        };
        await SqlDatabaseService.savePart(updatedPart);
        setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
      }
    } catch (error) {
      console.error('Error updating part raw material:', error);
    }
  };

  // Calendar methods
  const addHoliday = async (holiday: Holiday) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          holidays: [...calendarState.holidays, holiday]
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
    }
  };

  const removeHoliday = async (id: string) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          holidays: calendarState.holidays.filter(holiday => holiday.id !== id)
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
      }
    } catch (error) {
      console.error('Error removing holiday:', error);
    }
  };

  const addShiftTime = async (shiftTime: ShiftTime) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          shiftTimes: [...calendarState.shiftTimes, shiftTime]
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
      }
    } catch (error) {
      console.error('Error adding shift time:', error);
    }
  };

  const removeShiftTime = async (id: string) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          shiftTimes: calendarState.shiftTimes.filter(shift => shift.id !== id),
          dayShiftToggles: calendarState.dayShiftToggles.filter(toggle => toggle.shiftTimeId !== id)
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
      }
    } catch (error) {
      console.error('Error removing shift time:', error);
    }
  };

  const toggleShift = async (date: string, shiftTimeId: string) => {
    try {
      if (calendarState) {
        const existingToggle = calendarState.dayShiftToggles.find(
          toggle => toggle.date === date && toggle.shiftTimeId === shiftTimeId
        );

        let updatedToggles;
        
        if (existingToggle) {
          updatedToggles = calendarState.dayShiftToggles.map(toggle => {
            if (toggle.date === date && toggle.shiftTimeId === shiftTimeId) {
              return { ...toggle, isActive: !toggle.isActive };
            }
            return toggle;
          });
        } else {
          updatedToggles = [
            ...calendarState.dayShiftToggles,
            {
              id: `${date}-${shiftTimeId}`,
              date,
              shiftTimeId,
              isActive: true
            }
          ];
        }
        
        const updatedCalendarState = {
          ...calendarState,
          dayShiftToggles: updatedToggles
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
      }
    } catch (error) {
      console.error('Error toggling shift:', error);
    }
  };

  const setViewDate = async (date: string) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          viewDate: date
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
      }
    } catch (error) {
      console.error('Error setting view date:', error);
    }
  };

  // Context value object
  const contextValue: DataContextType = {
    isLoading,
    machines,
    parts,
    consumables,
    rawMaterials,
    partConsumables,
    partRawMaterials,
    calendarState,
    
    // Units and categories
    units,
    setUnits,
    machineCategories,
    setMachineCategories,
    partCategories,
    setPartCategories,
    
    // Direct state setters
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
    
    // Calendar methods
    addHoliday,
    removeHoliday,
    addShiftTime,
    removeShiftTime,
    toggleShift,
    setViewDate,
  };

  // If loading, show loading screen
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
