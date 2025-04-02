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
import DatabaseService from '@/services/db/DatabaseService';

interface DataContextType {
  isLoading: boolean;
  machines: Machine[];
  parts: Part[];
  consumables: Consumable[];
  rawMaterials: RawMaterial[];
  partConsumables: PartConsumable[];
  partRawMaterials: PartRawMaterial[];
  calendarState: CalendarState | null;
  
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
  
  // Initialize database and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initialize the database
        await DatabaseService.initialize();
        
        // Load initial data
        const loadedMachines = await DatabaseService.getAllMachines();
        const loadedParts = await DatabaseService.getAllParts();
        const loadedConsumables = await DatabaseService.getAllConsumables();
        const loadedRawMaterials = await DatabaseService.getAllRawMaterials();
        const loadedPartConsumables = await DatabaseService.getAllPartConsumables();
        const loadedPartRawMaterials = await DatabaseService.getAllPartRawMaterials();
        const loadedCalendarState = await DatabaseService.getCalendarState();
        
        // Update state
        setMachines(loadedMachines || []);
        setParts(loadedParts || []);
        setConsumables(loadedConsumables || []);
        setRawMaterials(loadedRawMaterials || []);
        setPartConsumables(loadedPartConsumables || []);
        setPartRawMaterials(loadedPartRawMaterials || []);
        
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
          
          await DatabaseService.setCalendarState(initialCalendarState);
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
      await DatabaseService.addMachine(machine);
      setMachines(prevMachines => [...prevMachines, machine]);
    } catch (error) {
      console.error('Error adding machine:', error);
    }
  };

  const updateMachine = async (id: string, machine: Machine) => {
    try {
      await DatabaseService.updateMachine(id, machine);
      setMachines(prevMachines =>
        prevMachines.map(m => (m.id === id ? machine : m))
      );
    } catch (error) {
      console.error('Error updating machine:', error);
    }
  };

  const removeMachine = async (id: string) => {
    try {
      await DatabaseService.removeMachine(id);
      setMachines(prevMachines => prevMachines.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error removing machine:', error);
    }
  };
  
  // Part methods
  const addPart = async (part: Part) => {
    try {
      await DatabaseService.addPart(part);
      setParts(prevParts => [...prevParts, part]);
    } catch (error) {
      console.error('Error adding part:', error);
    }
  };

  const updatePart = async (id: string, part: Part) => {
    try {
      await DatabaseService.updatePart(id, part);
      setParts(prevParts =>
        prevParts.map(p => (p.id === id ? part : p))
      );
    } catch (error) {
      console.error('Error updating part:', error);
    }
  };

  const removePart = async (id: string) => {
    try {
      await DatabaseService.removePart(id);
      setParts(prevParts => prevParts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error removing part:', error);
    }
  };
  
  // Consumable methods
  const addConsumable = async (consumable: Consumable) => {
    try {
      await DatabaseService.addConsumable(consumable);
      setConsumables(prevConsumables => [...prevConsumables, consumable]);
    } catch (error) {
      console.error('Error adding consumable:', error);
    }
  };

  const updateConsumable = async (id: string, consumable: Consumable) => {
    try {
      await DatabaseService.updateConsumable(id, consumable);
      setConsumables(prevConsumables =>
        prevConsumables.map(c => (c.id === id ? consumable : c))
      );
    } catch (error) {
      console.error('Error updating consumable:', error);
    }
  };

  const removeConsumable = async (id: string) => {
    try {
      await DatabaseService.removeConsumable(id);
      setConsumables(prevConsumables => prevConsumables.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error removing consumable:', error);
    }
  };
  
  // Raw Material methods
  const addRawMaterial = async (rawMaterial: RawMaterial) => {
    try {
      await DatabaseService.addRawMaterial(rawMaterial);
      setRawMaterials(prevRawMaterials => [...prevRawMaterials, rawMaterial]);
    } catch (error) {
      console.error('Error adding raw material:', error);
    }
  };

  const updateRawMaterial = async (id: string, rawMaterial: RawMaterial) => {
    try {
      await DatabaseService.updateRawMaterial(id, rawMaterial);
      setRawMaterials(prevRawMaterials =>
        prevRawMaterials.map(rm => (rm.id === id ? rawMaterial : rm))
      );
    } catch (error) {
      console.error('Error updating raw material:', error);
    }
  };

  const removeRawMaterial = async (id: string) => {
    try {
      await DatabaseService.removeRawMaterial(id);
      setRawMaterials(prevRawMaterials => prevRawMaterials.filter(rm => rm.id !== id));
    } catch (error) {
      console.error('Error removing raw material:', error);
    }
  };
  
  // Part Relationships methods
  const addPartConsumable = async (relationship: PartConsumable) => {
    try {
      await DatabaseService.addPartConsumable(relationship);
      setPartConsumables(prev => [...prev, relationship]);
    } catch (error) {
      console.error('Error adding part consumable:', error);
    }
  };

  const removePartConsumable = async (partId: string, consumableId: string) => {
    try {
      await DatabaseService.removePartConsumable(partId, consumableId);
      setPartConsumables(prev => prev.filter(
        pc => !(pc.partId === partId && pc.consumableId === consumableId)
      ));
    } catch (error) {
      console.error('Error removing part consumable:', error);
    }
  };

  const updatePartConsumable = async (partId: string, consumableId: string, amount: number) => {
    try {
      await DatabaseService.updatePartConsumable(partId, consumableId, amount);
      setPartConsumables(prev => prev.map(pc => {
        if (pc.partId === partId && pc.consumableId === consumableId) {
          return { ...pc, amount };
        }
        return pc;
      }));
    } catch (error) {
      console.error('Error updating part consumable:', error);
    }
  };

  const addPartRawMaterial = async (relationship: PartRawMaterial) => {
    try {
      await DatabaseService.addPartRawMaterial(relationship);
      setPartRawMaterials(prev => [...prev, relationship]);
    } catch (error) {
      console.error('Error adding part raw material:', error);
    }
  };

  const removePartRawMaterial = async (partId: string, rawMaterialId: string) => {
    try {
      await DatabaseService.removePartRawMaterial(partId, rawMaterialId);
      setPartRawMaterials(prev => prev.filter(
        pc => !(pc.partId === partId && pc.rawMaterialId === rawMaterialId)
      ));
    } catch (error) {
      console.error('Error removing part raw material:', error);
    }
  };

  const updatePartRawMaterial = async (partId: string, rawMaterialId: string, amount: number) => {
    try {
      await DatabaseService.updatePartRawMaterial(partId, rawMaterialId, amount);
      setPartRawMaterials(prev => prev.map(pc => {
        if (pc.partId === partId && pc.rawMaterialId === rawMaterialId) {
          return { ...pc, amount };
        }
        return pc;
      }));
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
        
        await DatabaseService.setCalendarState(updatedCalendarState);
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
        
        await DatabaseService.setCalendarState(updatedCalendarState);
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
        
        await DatabaseService.setCalendarState(updatedCalendarState);
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
        
        await DatabaseService.setCalendarState(updatedCalendarState);
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
          // Toggle existing entry
          updatedToggles = calendarState.dayShiftToggles.map(toggle => {
            if (toggle.date === date && toggle.shiftTimeId === shiftTimeId) {
              return { ...toggle, isActive: !toggle.isActive };
            }
            return toggle;
          });
        } else {
          // Create new entry
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
        
        await DatabaseService.setCalendarState(updatedCalendarState);
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
        
        await DatabaseService.setCalendarState(updatedCalendarState);
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
