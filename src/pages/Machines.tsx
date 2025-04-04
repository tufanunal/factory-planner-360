
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MachineCard from '@/components/machines/MachineCard';
import MachineEditModal from '@/components/machines/MachineEditModal';
import { Machine } from '@/types/machine';
import { toast } from 'sonner';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import CategoryManager from '@/components/machines/CategoryManager';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MachineStats } from '@/components/machines/MachineStats';
import { MachineFilter } from '@/components/machines/MachineFilter';

const Machines = () => {
  const { machines, machineCategories, setMachineCategories, addMachine, removeMachine } = useData();
  const [openMachine, setOpenMachine] = useState<Machine | null>(null);
  const [isAddingMachine, setIsAddingMachine] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const handleAddMachine = () => {
    setOpenMachine(null);
    setIsAddingMachine(true);
  };
  
  const handleEditMachine = (machine: Machine) => {
    setOpenMachine(machine);
    setIsAddingMachine(true);
  };
  
  const handleDeleteMachine = (machine: Machine) => {
    setMachineToDelete(machine);
    setIsDeleteConfirmOpen(true);
  };
  
  const confirmDeleteMachine = async () => {
    if (machineToDelete) {
      try {
        await removeMachine(machineToDelete.id);
        toast.success(`Machine ${machineToDelete.name} deleted successfully`);
      } catch (error) {
        console.error('Error deleting machine:', error);
        toast.error('Failed to delete machine');
      } finally {
        setIsDeleteConfirmOpen(false);
        setMachineToDelete(null);
      }
    }
  };
  
  const handleSaveMachine = async (machine: Machine) => {
    try {
      const isEditing = !!machines.find(m => m.id === machine.id);
      
      if (isEditing) {
        // Machine is updated through the context
        await addMachine(machine);
        toast.success('Machine updated successfully');
      } else {
        // New machine is added
        await addMachine(machine);
        toast.success('Machine added successfully');
      }
      
      setIsAddingMachine(false);
      setOpenMachine(null);
    } catch (error) {
      console.error('Error saving machine:', error);
      toast.error('Failed to save machine');
    }
  };
  
  const filteredMachines = selectedCategory 
    ? machines.filter(machine => machine.category === selectedCategory)
    : machines;
  
  return (
    <DashboardLayout 
      title="Machines" 
      description="View and manage all your production machines"
    >
      <MachineStats machines={machines} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <MachineFilter 
            categories={machineCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        <div className="flex flex-wrap justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsCategoryManagerOpen(true)}
          >
            Manage Categories
          </Button>
          <Button onClick={() => handleAddMachine()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Machine
          </Button>
        </div>
      </div>
      
      {filteredMachines.length === 0 ? (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>No Machines</CardTitle>
            <CardDescription>
              {selectedCategory 
                ? `No machines found in the "${selectedCategory}" category.`
                : 'No machines have been added yet.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => handleAddMachine()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Machine
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMachines.map((machine, index) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onEdit={() => handleEditMachine(machine)}
              onDelete={() => handleDeleteMachine(machine)}
              className={`animate-fade-up delay-${index * 100}`}
            />
          ))}
        </div>
      )}
      
      <MachineEditModal
        machine={openMachine}
        open={isAddingMachine}
        onClose={() => setIsAddingMachine(false)}
        onSave={handleSaveMachine}
      />
      
      <CategoryManager
        open={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
        onCategoryChange={setMachineCategories}
        machines={machines}
      />
      
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the machine 
              &quot;{machineToDelete?.name}&quot; and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteMachine}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Machines;
