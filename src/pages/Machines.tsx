
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MachineCard from '@/components/machines/MachineCard';
import MachineEditModal from '@/components/machines/MachineEditModal';
import { Machine } from '@/types/machine';
import { toast } from 'sonner';
import { AlertDialog, 
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const Machines = () => {
  const { machines, setMachines, machineCategories, setMachineCategories, addMachine, removeMachine } = useData();
  const [openMachine, setOpenMachine] = useState<Machine | null>(null);
  const [isAddingMachine, setIsAddingMachine] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const totalMachines = machines.length;
  const operationalMachines = machines.filter(m => m.status === 'Operational').length;
  const maintenanceMachines = machines.filter(m => m.status === 'Maintenance').length;
  const offlineMachines = machines.filter(m => m.status === 'Offline').length;
  
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
        setMachines(machines.map(m => m.id === machine.id ? machine : m));
      } else {
        const newMachine = { 
          ...machine, 
          id: machine.id || generateId() 
        };
        await addMachine(newMachine);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMachines}</div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 5v14" />
              <path d="m5 12 7 7 7-7" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{operationalMachines}</div>
            <p className="text-xs text-muted-foreground">
              {totalMachines > 0 
                ? `${Math.round(operationalMachines / totalMachines * 100)}% of total`
                : 'No machines'}
            </p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 5v14" />
              <path d="m5 12 7 7 7-7" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceMachines}</div>
            <p className="text-xs text-muted-foreground">
              {totalMachines > 0 
                ? `${Math.round(maintenanceMachines / totalMachines * 100)}% of total`
                : 'No machines'}
            </p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 5v14" />
              <path d="m5 12 7 7 7-7" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{offlineMachines}</div>
            <p className="text-xs text-muted-foreground">
              {totalMachines > 0 
                ? `${Math.round(offlineMachines / totalMachines * 100)}% of total`
                : 'No machines'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <Tabs 
            defaultValue={selectedCategory || "all"} 
            className="w-full"
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              {machineCategories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-wrap justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsCategoryManagerOpen(true)}
          >
            Manage Categories
          </Button>
          <Button onClick={handleAddMachine}>
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
            <Button onClick={handleAddMachine}>
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
        categories={machineCategories}
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
