
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
  );
};
