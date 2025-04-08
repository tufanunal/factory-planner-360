
import { useState, useEffect } from 'react';
import { 
  Machine, 
  Part, 
  Consumable, 
  RawMaterial,
  CalendarState, 
  PartConsumable, 
  PartRawMaterial 
} from '@/types/all';
import DatabaseService from '@/services/db/DatabaseServiceAdapter';

export function useDataInitialization() {
  const [isLoading, setIsLoading] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [partConsumables, setPartConsumables] = useState<PartConsumable[]>([]);
  const [partRawMaterials, setPartRawMaterials] = useState<PartRawMaterial[]>([]);
  const [calendarState, setCalendarState] = useState<CalendarState | null>(null);
  
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('Initializing database service...');
        await DatabaseService.initialize();
        
        console.log('Loading data from database...');
        const loadedMachines = await DatabaseService.getMachines();
        const loadedParts = await DatabaseService.getParts();
        const loadedConsumables = await DatabaseService.getConsumables();
        const loadedRawMaterials = await DatabaseService.getRawMaterials();
        const loadedCalendarState = await DatabaseService.getCalendarState();
        
        console.log('Setting state with loaded data...');
        setMachines(loadedMachines || []);
        setParts(loadedParts || []);
        setConsumables(loadedConsumables || []);
        setRawMaterials(loadedRawMaterials || []);
        
        if (!loadedCalendarState) {
          // Create default calendar state if none exists
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
          
          console.log('Creating initial calendar state...');
          await DatabaseService.setCalendarState(initialCalendarState);
          setCalendarState(initialCalendarState);
        } else {
          setCalendarState(loadedCalendarState);
        }
        
        console.log('Data initialization complete');
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);
  
  return {
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
  };
}
