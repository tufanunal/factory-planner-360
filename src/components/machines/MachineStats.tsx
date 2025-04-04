
import { Machine } from '@/types/machine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MachineStatsProps {
  machines: Machine[];
}

export const MachineStats = ({ machines }: MachineStatsProps) => {
  const totalMachines = machines.length;
  const operationalMachines = machines.filter(m => m.status === 'Operational').length;
  const maintenanceMachines = machines.filter(m => m.status === 'Maintenance').length;
  const offlineMachines = machines.filter(m => m.status === 'Offline').length;
  
  // Calculate the average availability percentage
  const averageAvailability = totalMachines > 0
    ? Math.round(machines.reduce((sum, machine) => sum + (machine.availability || 0), 0) / totalMachines)
    : 0;
  
  return (
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
          <CardTitle className="text-sm font-medium">Average Availability</CardTitle>
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{averageAvailability}%</div>
          <p className="text-xs text-muted-foreground">
            {totalMachines > 0 
              ? `Based on ${totalMachines} machines`
              : 'No machines'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
