
import { Machine } from '@/types/all';
import DatabaseService from '@/services/db/DatabaseServiceAdapter';

export function useMachineOperations(
  machines: Machine[],
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>
) {
  const addMachine = async (machine: Machine) => {
    try {
      await DatabaseService.saveMachine(machine);
      setMachines(prevMachines => [...prevMachines, machine]);
    } catch (error) {
      console.error('Error adding machine:', error);
    }
  };

  const updateMachine = async (id: string, machine: Machine) => {
    try {
      await DatabaseService.saveMachine(machine);
      setMachines(prevMachines =>
        prevMachines.map(m => (m.id === id ? machine : m))
      );
    } catch (error) {
      console.error('Error updating machine:', error);
    }
  };

  const removeMachine = async (id: string) => {
    try {
      await DatabaseService.deleteMachine(id);
      setMachines(prevMachines => prevMachines.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error removing machine:', error);
    }
  };
  
  return {
    addMachine,
    updateMachine,
    removeMachine
  };
}
