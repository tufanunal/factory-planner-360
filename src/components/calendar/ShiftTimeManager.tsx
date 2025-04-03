
import { useState } from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useData } from '@/contexts/DataContext';
import { ShiftTime } from '@/types/calendar';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ShiftTimeManagerProps {
  shiftTimes: ShiftTime[];
}

const ShiftTimeManager = ({ shiftTimes }: ShiftTimeManagerProps) => {
  const { addShiftTime, removeShiftTime, updateShiftTime } = useData();
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('blue');
  const [editMode, setEditMode] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftTime | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const colorOptions = [
    { name: 'Blue', value: 'blue', hex: '#3b82f6' },
    { name: 'Green', value: 'green', hex: '#22c55e' },
    { name: 'Yellow', value: 'yellow', hex: '#eab308' },
    { name: 'Red', value: 'red', hex: '#ef4444' },
    { name: 'Purple', value: 'purple', hex: '#8b5cf6' },
    { name: 'Pink', value: 'pink', hex: '#ec4899' },
    { name: 'Indigo', value: 'indigo', hex: '#6366f1' },
    { name: 'Cyan', value: 'cyan', hex: '#06b6d4' },
    { name: 'Teal', value: 'teal', hex: '#14b8a6' },
    { name: 'Orange', value: 'orange', hex: '#f97316' },
    { name: 'Amber', value: 'amber', hex: '#f59e0b' },
    { name: 'Lime', value: 'lime', hex: '#84cc16' },
    { name: 'Emerald', value: 'emerald', hex: '#10b981' },
    { name: 'Sky', value: 'sky', hex: '#0ea5e9' },
    { name: 'Violet', value: 'violet', hex: '#8b5cf6' },
    { name: 'Fuchsia', value: 'fuchsia', hex: '#d946ef' },
  ];

  const resetForm = () => {
    setName('');
    setStartTime('');
    setEndTime('');
    setColor('blue');
    setEditMode(false);
    setEditingShift(null);
  };

  const openEditDialog = (shift: ShiftTime) => {
    setEditingShift(shift);
    setName(shift.name);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setColor(shift.color);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSaveShift = async () => {
    if (!name || !startTime || !endTime) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editMode && editingShift) {
        await updateShiftTime({
          ...editingShift,
          name,
          startTime,
          endTime,
          color,
        });
        toast.success("Shift time updated successfully");
      } else {
        await addShiftTime({
          id: Date.now().toString(),
          name,
          startTime,
          endTime,
          color,
        });
        toast.success("Shift time added successfully");
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving shift time:", error);
      toast.error(editMode ? "Failed to update shift time" : "Failed to add shift time");
    }
  };

  const handleRemoveShiftTime = async (id: string) => {
    if (removeShiftTime) {
      try {
        await removeShiftTime(id);
        toast.success("Shift time removed successfully");
      } catch (error) {
        console.error("Error removing shift time:", error);
        toast.error("Failed to remove shift time");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit shift time dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full"
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Shift Time
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Shift Time" : "Add Shift Time"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shift-name">Shift Name</Label>
              <Input
                id="shift-name"
                placeholder="E.g., Morning Shift"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="shift-color">Shift Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    className={`h-10 ${color === option.value ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`}
                    onClick={() => setColor(option.value)}
                    style={{
                      backgroundColor: option.hex,
                      borderColor: option.hex
                    }}
                    title={option.name}
                  >
                    <span className="sr-only">{option.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleSaveShift} 
              disabled={!name || !startTime || !endTime}
              className="w-full mt-2"
            >
              {editMode ? "Update Shift Time" : "Add Shift Time"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
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
                        backgroundColor: colorOptions.find(c => c.value === shift.color)?.hex || `var(--${shift.color}-500)` 
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(shift)}
                        className="hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveShiftTime(shift.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
