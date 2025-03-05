
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Settings, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const MachinesPage = () => {
  // Mock data for machines
  const machines = [
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
  ];

  // Function to get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-600 hover:bg-amber-200';
      case 'Offline':
        return 'bg-red-100 text-red-600 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };

  return (
    <DashboardLayout 
      title="Machines" 
      description="Manage machine availability, setup time and maintenance schedules"
    >
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 mb-6 animate-fade-in">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="planning">Production Planning</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
            
        <TabsContent value="overview" className="animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {machines.map((machine) => (
              <Card key={machine.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{machine.name}</CardTitle>
                    <Badge variant="outline" className={getStatusBadge(machine.status)}>
                      {machine.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Last maintained on {machine.lastMaintenance}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Availability</span>
                        <span className="text-sm font-medium">{machine.availability}%</span>
                      </div>
                      <Progress value={machine.availability} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Setup Time</span>
                        <span className="font-medium">{machine.setupTime}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Next Maintenance</span>
                        <span className="font-medium">{machine.nextMaintenance}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Settings className="h-4 w-4 mr-1" />
                        <span>Machine Details</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Timeline</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    <div>
                      <Badge variant="outline" className={
                        new Date(machine.nextMaintenance) <= new Date() 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }>
                        {new Date(machine.nextMaintenance) <= new Date() ? 'Overdue' : 'Scheduled'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MachinesPage;
