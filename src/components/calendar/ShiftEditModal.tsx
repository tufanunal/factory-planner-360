
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shift } from '@/types/calendar';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

interface ShiftEditModalProps {
  shift: Shift | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (shift: Shift) => void;
}

const COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-green-100', text: 'text-green-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { bg: 'bg-red-100', text: 'text-red-600' },
  { bg: 'bg-gray-100', text: 'text-gray-600' },
];

const ShiftEditModal: React.FC<ShiftEditModalProps> = ({ shift, isOpen, onClose, onSave }) => {
  const { shifts } = useData();
  const [formData, setFormData] = useState<Shift>({
    id: 0,
    name: '',
    startTime: '08:00',
    endTime: '16:00',
    team: '',
    color: COLORS[0].bg + ' ' + COLORS[0].text,
  });
  const [showCircularWarning, setShowCircularWarning] = useState(false);

  useEffect(() => {
    // Reset form when modal opens/closes or shift changes
    if (shift) {
      setFormData({
        ...shift
      });
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        startTime: '08:00',
        endTime: '16:00',
        team: '',
        color: COLORS[0].bg + ' ' + COLORS[0].text,
      });
    }
    // Reset warning state
    setShowCircularWarning(false);
  }, [shift, isOpen]);

  const handleChange = (field: keyof Shift, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Show warning when time fields change
    if (field === 'startTime' || field === 'endTime') {
      setShowCircularWarning(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!formData.name || !formData.startTime || !formData.endTime || !formData.team) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Find shifts based on the circular relationship
    const morningShift = shifts.find(s => s.name.toLowerCase().includes('morning'));
    const afternoonShift = shifts.find(s => s.name.toLowerCase().includes('afternoon'));
    const nightShift = shifts.find(s => s.name.toLowerCase().includes('night'));
    
    // Save the current shift
    onSave(formData);
    
    // Apply circular time updates for related shifts if this shift was modified
    if (shift && (shift.startTime !== formData.startTime || shift.endTime !== formData.endTime)) {
      const updatedShifts: Shift[] = [];
      
      if (formData.id === morningShift?.id) {
        // If morning shift changed
        if (afternoonShift) {
          updatedShifts.push({
            ...afternoonShift,
            startTime: formData.endTime
          });
        }
        if (nightShift) {
          updatedShifts.push({
            ...nightShift,
            endTime: formData.startTime
          });
        }
      } else if (formData.id === afternoonShift?.id) {
        // If afternoon shift changed
        if (nightShift) {
          updatedShifts.push({
            ...nightShift,
            startTime: formData.endTime
          });
        }
        if (morningShift) {
          updatedShifts.push({
            ...morningShift,
            endTime: formData.startTime
          });
        }
      } else if (formData.id === nightShift?.id) {
        // If night shift changed
        if (morningShift) {
          updatedShifts.push({
            ...morningShift,
            startTime: formData.endTime
          });
        }
        if (afternoonShift) {
          updatedShifts.push({
            ...afternoonShift,
            endTime: formData.startTime
          });
        }
      }
      
      // Save the related shifts
      if (updatedShifts.length > 0) {
        updatedShifts.forEach(s => onSave(s));
        toast.info(`Updated ${updatedShifts.length} related shifts to maintain circular timing`);
      }
    }
    
    toast.success(shift ? 'Shift updated successfully' : 'Shift added successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{shift ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
            <DialogDescription>
              {shift ? 'Modify this shift\'s details. Changing times will affect other shifts.' : 'Create a new shift for your schedule'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="col-span-3"
                placeholder="Morning Shift"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Time
              </Label>
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-xs">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-xs">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {showCircularWarning && (
              <div className="col-span-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <strong>Note:</strong> Changing shift times will automatically update connected shifts 
                  to maintain the circular relationship (Morning → Afternoon → Night → Morning).
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-right">
                Team
              </Label>
              <div className="col-span-3 relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="team"
                  value={formData.team}
                  onChange={(e) => handleChange('team', e.target.value)}
                  className="pl-10"
                  placeholder="Team A"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Color
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {COLORS.map((color, index) => (
                  <div 
                    key={index}
                    className={`w-8 h-8 rounded-full cursor-pointer ${color.bg} ${color.text} flex items-center justify-center border-2 ${formData.color === `${color.bg} ${color.text}` ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => handleChange('color', `${color.bg} ${color.text}`)}
                  >
                    {formData.color === `${color.bg} ${color.text}` && <div className="w-2 h-2 rounded-full bg-current"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftEditModal;
