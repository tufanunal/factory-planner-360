
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Settings, Clock, Pencil, Trash2 } from 'lucide-react';
import { Machine } from '@/types/machine';

interface MachineCardProps {
  machine: Machine;
  onEdit: (machine: Machine) => void;
  onDelete: (machine: Machine) => void;
  className?: string;
}

const MachineCard = ({ machine, onEdit, onDelete, className }: MachineCardProps) => {
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
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{machine.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusBadge(machine.status)}>
              {machine.status}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(machine)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive" 
              onClick={() => onDelete(machine)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
  );
};

export default MachineCard;
