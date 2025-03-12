
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, FilterableSelect } from '@/components/ui/select';
import { toast } from 'sonner';
import { Machine } from '@/types/machine';
import { DEFAULT_CATEGORY } from './CategoryManager';
import { useData } from '@/contexts/DataContext';
import { Euro } from 'lucide-react';

interface MachineEditModalProps {
  machine: Machine | null;
  open: boolean;
  onClose: () => void;
  onSave: (machine: Machine) => void;
  categories?: string[];
}

const MachineEditModal = ({ 
  machine, 
  open, 
  onClose, 
  onSave, 
  categories: propCategories 
}: MachineEditModalProps) => {
  const { machineCategories } = useData();
  const categories = propCategories || machineCategories || [DEFAULT_CATEGORY];

  const [formData, setFormData] = useState<Machine>({
    id: 0,
    name: '',
    status: 'Operational',
    availability: 0,
    setupTime: '',
    lastMaintenance: '',
    nextMaintenance: '',
    category: DEFAULT_CATEGORY,
    hourlyCost: 0,
    labourPersonHour: 0,
  });

  useEffect(() => {
    if (machine) {
      setFormData({
        ...machine,
        category: machine.category || DEFAULT_CATEGORY,
        hourlyCost: machine.hourlyCost || 0,
        labourPersonHour: machine.labourPersonHour || 0
      });
    } else {
      setFormData({
        id: 0,
        name: '',
        status: 'Operational',
        availability: 0,
        setupTime: '',
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date().toISOString().split('T')[0],
        category: DEFAULT_CATEGORY,
        hourlyCost: 0,
        labourPersonHour: 0
      });
    }
  }, [machine]);

  const handleChange = (field: keyof Machine, value: string | number) => {
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
                value={formData.availability || ''}
                onChange={(e) => handleChange('availability', parseInt(e.target.value) || 0)}
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
              <FilterableSelect 
                value={formData.category || DEFAULT_CATEGORY} 
                onValueChange={(value) => handleChange('category', value)}
                triggerClassName="col-span-3"
              >
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </FilterableSelect>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hourlyCost" className="text-right">
                Hourly Cost
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="hourlyCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourlyCost || ''}
                  onChange={(e) => handleChange('hourlyCost', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Euro className="h-4 w-4" />
                </div>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  /h
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="labourPersonHour" className="text-right">
                Labour
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="labourPersonHour"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.labourPersonHour || ''}
                  onChange={(e) => handleChange('labourPersonHour', parseFloat(e.target.value) || 0)}
                  className="pr-14"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  person/h
                </div>
              </div>
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
