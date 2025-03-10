import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Layers, PlusCircle } from 'lucide-react';
import { Machine } from '@/types/machine';
import MachineCard from '@/components/machines/MachineCard';
import MachineEditModal from '@/components/machines/MachineEditModal';
import CategoryManager, { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

const MachinesPage = () => {
  const { machines, setMachines, machineCategories, setMachineCategories } = useData();
  
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine(machine);
    setIsModalOpen(true);
  };

  const handleAddNewMachine = () => {
    setEditingMachine(null);
    setIsModalOpen(true);
  };

  const handleSaveMachine = (updatedMachine: Machine) => {
    if (updatedMachine.id) {
      setMachines(machines.map(machine => 
        machine.id === updatedMachine.id ? updatedMachine : machine
      ));
    } else {
      const newMachine = {
        ...updatedMachine,
        id: Math.max(0, ...machines.map(m => m.id)) + 1
      };
      setMachines([...machines, newMachine]);
      toast.success('New machine added successfully');
    }
    setIsModalOpen(false);
  };

  const handleCategoryChange = (updatedCategories: string[]) => {
    setMachineCategories(updatedCategories);
    
    const updatedMachines = machines.map(machine => {
      if (machine.category && !updatedCategories.includes(machine.category)) {
        return { ...machine, category: DEFAULT_CATEGORY };
      }
      return machine;
    });
    
    if (JSON.stringify(updatedMachines) !== JSON.stringify(machines)) {
      setMachines(updatedMachines);
      toast.info('Some machines were updated to the default category');
    }
  };

  return (
    <DashboardLayout 
      title="Machines" 
      description="Manage machine availability, setup time and maintenance schedules"
    >
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-[500px] grid-cols-4 animate-fade-in">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <Button onClick={handleAddNewMachine} className="ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Machine
            </Button>
          </div>
              
          <TabsContent value="overview" className="animate-slide-up mt-6">
            {machines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {machines.map((machine) => (
                  <MachineCard 
                    key={machine.id} 
                    machine={machine} 
                    onEdit={handleEditMachine} 
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <p className="text-muted-foreground">No machines added yet.</p>
                  <Button onClick={handleAddNewMachine}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Machine
                  </Button>
                </div>
              </Card>
            )}
            
            {machines.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Machine Availability Overview</CardTitle>
                    <CardDescription>Average availability of all machines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-center">
                      <p className="text-muted-foreground">Machine performance charts will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="planning" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle>Production Planning</CardTitle>
                <CardDescription>Schedule and optimize machine usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center text-center">
                  <div>
                    <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Production planning interface will be implemented in the next phase
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>Upcoming and past maintenance activities</CardDescription>
              </CardHeader>
              <CardContent>
                {machines.length > 0 ? (
                  <div className="space-y-4">
                    {machines.map((machine) => (
                      <div 
                        key={`maint-${machine.id}`}
                        className="p-4 border rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full mr-4 flex items-center justify-center ${
                            new Date(machine.nextMaintenance) <= new Date() 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {new Date(machine.nextMaintenance) <= new Date() 
                              ? <AlertTriangle className="h-5 w-5" />
                              : <CheckCircle className="h-5 w-5" />
                            }
                          </div>
                          <div>
                            <h3 className="font-medium">{machine.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Next scheduled: {machine.nextMaintenance}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditMachine(machine)}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No machines added yet.</p>
                    <Button onClick={handleAddNewMachine} className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Machine
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <CategoryManager 
                  onCategoryChange={handleCategoryChange}
                  machines={machines}
                />
              </div>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Machine Categories & Compatibility</CardTitle>
                  <CardDescription>Configure machine interchangeability and parts compatibility</CardDescription>
                </CardHeader>
                <CardContent>
                  {machines.length > 0 ? (
                    <div className="space-y-4">
                      {machines.map((machine) => (
                        <div 
                          key={`adv-${machine.id}`}
                          className="p-4 border rounded-lg flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full mr-4 flex items-center justify-center bg-blue-100 text-blue-600">
                              <Layers className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{machine.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Category: {machine.category || DEFAULT_CATEGORY} | 
                                Compatible parts: {machine.compatibleParts?.length || 0}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditMachine(machine)}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No machines added yet.</p>
                      <Button onClick={handleAddNewMachine} className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Machine
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MachineEditModal 
        machine={editingMachine} 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMachine}
        categories={machineCategories} 
      />
    </DashboardLayout>
  );
};

export default MachinesPage;
