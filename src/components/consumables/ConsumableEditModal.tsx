
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Consumable } from '@/types/consumable';

interface ConsumableEditModalProps {
  consumable: Consumable | null;
  open: boolean;
  onClose: () => void;
  onSave: (consumable: Consumable) => void;
  units: string[];
}

const ConsumableEditModal = ({ 
  consumable, 
  open, 
  onClose, 
  onSave,
  units
}: ConsumableEditModalProps) => {
  const [formData, setFormData] = useState<Consumable>({
    id: '',
    name: '',
    unit: units[0] || 'pcs',
    stock: 0,
    costPerUnit: 0
  });

  useEffect(() => {
    if (consumable) {
      setFormData({
        ...consumable
      });
    } else {
      // Reset form for new consumable
      setFormData({
        id: '',
        name: '',
        unit: units[0] || 'pcs',
        stock: 0,
        costPerUnit: 0
      });
    }
  }, [consumable, units]);

  const handleChange = (field: keyof Consumable, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    onSave(formData);
    toast.success(`Consumable ${consumable ? 'updated' : 'added'} successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{consumable ? 'Edit Consumable' : 'Add New Consumable'}</DialogTitle>
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
              <Label htmlFor="unit" className="text-right">
                Unit
              </Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => handleChange('unit', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="0.01"
                value={formData.stock}
                onChange={(e) => handleChange('stock', parseFloat(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costPerUnit" className="text-right">
                Cost Per Unit
              </Label>
              <Input
                id="costPerUnit"
                type="number"
                min="0"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => handleChange('costPerUnit', parseFloat(e.target.value) || 0)}
                className="col-span-3"
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

export default ConsumableEditModal;
