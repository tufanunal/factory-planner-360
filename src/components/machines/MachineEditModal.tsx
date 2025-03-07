
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Machine } from '@/types/machine';
import { DEFAULT_CATEGORY } from './CategoryManager';

interface MachineEditModalProps {
  machine: Machine | null;
  open: boolean;
  onClose: () => void;
  onSave: (machine: Machine) => void;
  categories?: string[];
}

const MachineEditModal = ({ machine, open, onClose, onSave, categories = [DEFAULT_CATEGORY] }: MachineEditModalProps) => {
  const [formData, setFormData] = useState<Machine>({
    id: 0,
    name: '',
    status: 'Operational',
    availability: 0,
    setupTime: '',
    lastMaintenance: '',
    nextMaintenance: '',
    category: DEFAULT_CATEGORY,
    compatibleParts: [],
  });

  useEffect(() => {
    if (machine) {
      setFormData({
        ...machine,
        category: machine.category || DEFAULT_CATEGORY
      });
    } else {
      // Reset form for new machine
      setFormData({
        id: 0,
        name: '',
        status: 'Operational',
        availability: 0,
        setupTime: '',
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date().toISOString().split('T')[0],
        category: DEFAULT_CATEGORY,
        compatibleParts: [],
      });
    }
  }, [machine]);

  const handleChange = (field: keyof Machine, value: string | number | number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(machine ? 'Machine updated successfully' : 'Machine added successfully');
  };

  // Split comma-separated part IDs into an array of numbers
  const handleCompatiblePartsChange = (value: string) => {
    const partIds = value
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '')
      .map(id => parseInt(id, 10))
      .filter(id => !isNaN(id));
    
    handleChange('compatibleParts', partIds);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{machine ? 'Edit Machine' : 'Add New Machine'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value as 'Operational' | 'Maintenance' | 'Offline')}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availability" className="text-right">
                Availability %
              </Label>
              <Input
                id="availability"
                type="number"
                min="0"
                max="100"
                value={formData.availability}
                onChange={(e) => handleChange('availability', parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setupTime" className="text-right">
                Setup Time
              </Label>
              <Input
                id="setupTime"
                value={formData.setupTime}
                onChange={(e) => handleChange('setupTime', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastMaintenance" className="text-right">
                Last Maintenance
              </Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => handleChange('lastMaintenance', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nextMaintenance" className="text-right">
                Next Maintenance
              </Label>
              <Input
                id="nextMaintenance"
                type="date"
                value={formData.nextMaintenance}
                onChange={(e) => handleChange('nextMaintenance', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                value={formData.category || DEFAULT_CATEGORY} 
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="compatibleParts" className="text-right">
                Compatible Parts
              </Label>
              <Input
                id="compatibleParts"
                value={formData.compatibleParts?.join(', ') || ''}
                onChange={(e) => handleCompatiblePartsChange(e.target.value)}
                className="col-span-3"
                placeholder="Enter part IDs separated by commas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MachineEditModal;
