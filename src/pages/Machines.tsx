
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, PlusCircle } from 'lucide-react';
import { Machine } from '@/types/machine';
import MachineCard from '@/components/machines/MachineCard';
import MachineEditModal from '@/components/machines/MachineEditModal';
import { toast } from 'sonner';

const MachinesPage = () => {
  // Mock data for machines
  const [machines, setMachines] = useState<Machine[]>([
    { 
      id: 1, 
      name: 'CNC Machine A', 
      status: 'Operational', 
      availability: 97,
      setupTime: '45 min',
      lastMaintenance: '2023-05-15',
      nextMaintenance: '2023-08-15',
    },
    { 
      id: 2, 
      name: 'Assembly Line B', 
      status: 'Operational', 
      availability: 92,
      setupTime: '120 min',
      lastMaintenance: '2023-06-10',
      nextMaintenance: '2023-09-10',
    },
    { 
      id: 3, 
      name: 'Injection Mold C', 
      status: 'Maintenance', 
      availability: 0,
      setupTime: '90 min',
      lastMaintenance: '2023-07-01',
      nextMaintenance: '2023-07-03',
    },
    { 
      id: 4, 
      name: 'Packaging Unit D', 
      status: 'Operational', 
      availability: 99,
      setupTime: '30 min',
      lastMaintenance: '2023-07-01',
      nextMaintenance: '2023-10-01',
    },
  ]);

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
      // Update existing machine
      setMachines(machines.map(machine => 
        machine.id === updatedMachine.id ? updatedMachine : machine
      ));
    } else {
      // Add new machine
      const newMachine = {
        ...updatedMachine,
        id: Math.max(0, ...machines.map(m => m.id)) + 1
      };
      setMachines([...machines, newMachine]);
      toast.success('New machine added successfully');
    }
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout 
      title="Machines" 
      description="Manage machine availability, setup time and maintenance schedules"
    >
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-[400px] grid-cols-3 animate-fade-in">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            <Button onClick={handleAddNewMachine} className="ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Machine
            </Button>
          </div>
              
          <TabsContent value="overview" className="animate-slide-up mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {machines.map((machine) => (
                <MachineCard 
                  key={machine.id} 
                  machine={machine} 
                  onEdit={handleEditMachine} 
                />
              ))}
            </div>
            
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MachineEditModal 
        machine={editingMachine} 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMachine} 
      />
    </DashboardLayout>
  );
};

export default MachinesPage;
