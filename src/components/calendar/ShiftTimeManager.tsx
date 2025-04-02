
import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useData } from '@/contexts/DataContext';
import { ShiftTime } from '@/types/calendar';

interface ShiftTimeManagerProps {
  shiftTimes: ShiftTime[];
}

const ShiftTimeManager = ({ shiftTimes }: ShiftTimeManagerProps) => {
  const { addShiftTime, removeShiftTime } = useData();
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('blue');

  const colorOptions = [
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Red', value: 'red' },
    { name: 'Purple', value: 'purple' },
  ];

  const handleAddShiftTime = () => {
    if (!name || !startTime || !endTime) return;

    if (addShiftTime) {
      addShiftTime({
        id: Date.now().toString(),
        name,
        startTime,
        endTime,
        color,
      });
      
      // Reset form
      setName('');
      setStartTime('');
      setEndTime('');
      setColor('blue');
    }
  };

  const handleRemoveShiftTime = (id: string) => {
    if (removeShiftTime) {
      removeShiftTime(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add shift time form */}
      <div className="space-y-4 p-4 border rounded-lg bg-card">
        <h3 className="text-lg font-medium">Add Shift Time</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shift-name">Shift Name</Label>
            <Input
              id="shift-name"
              placeholder="E.g., Morning Shift"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shift-color">Shift Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  className={`h-10 ${color === option.value ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`}
                  onClick={() => setColor(option.value)}
                  style={{
                    backgroundColor: `var(--${option.value}-100)`,
                    borderColor: `var(--${option.value}-300)`
                  }}
                >
                  <span className="sr-only">{option.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleAddShiftTime} 
          disabled={!name || !startTime || !endTime}
          className="w-full mt-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Shift Time
        </Button>
      </div>
      
      {/* Shift times list */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shift Name</TableHead>
              <TableHead>Time Range</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shiftTimes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No shift times added yet
                </TableCell>
              </TableRow>
            ) : (
              shiftTimes.map(shift => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">{shift.name}</TableCell>
                  <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                  <TableCell>
                    <div 
                      className={`w-6 h-6 rounded-full`} 
                      style={{ 
                        backgroundColor: `var(--${shift.color}-500)` 
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveShiftTime(shift.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShiftTimeManager;
