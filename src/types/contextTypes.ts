
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

// Define the shape of our data context
export interface DataContextType {
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
  updateShiftTime: (shiftTime: ShiftTime) => Promise<void>;
  removeShiftTime: (id: string) => Promise<void>;
  toggleShift: (date: string, shiftTimeId: string) => Promise<void>;
  setViewDate: (date: string) => Promise<void>;
}
