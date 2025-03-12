
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
import { Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

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
  const [formData, setFormData] = useState<Shift>({
    id: 0,
    name: '',
    startTime: '00:00',
    endTime: '00:00',
    team: '',
    color: COLORS[0].bg + ' ' + COLORS[0].text,
  });

  useEffect(() => {
    if (shift) {
      setFormData({
        ...shift
      });
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        startTime: '00:00',
        endTime: '00:00',
        team: '',
        color: COLORS[0].bg + ' ' + COLORS[0].text,
      });
    }
  }, [shift, isOpen]);

  const handleChange = (field: keyof Shift, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(shift ? 'Shift updated successfully' : 'Shift added successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{shift ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
            <DialogDescription>
              {shift ? 'Modify this shift\'s details' : 'Create a new shift for your schedule'}
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
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <div className="col-span-3 relative">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <div className="col-span-3 relative">
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
