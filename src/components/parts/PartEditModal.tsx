
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Part } from '@/types/part';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';
import { useData } from '@/contexts/DataContext';

interface PartEditModalProps {
  part: Part | null;
  open: boolean;
  onClose: () => void;
  onSave: (part: Part) => void;
  categories?: string[];
}

const PartEditModal = ({ 
  part, 
  open, 
  onClose, 
  onSave, 
  categories: propCategories 
}: PartEditModalProps) => {
  // Use categories from context or from props as a fallback
  const { machineCategories } = useData();
  const categories = propCategories || machineCategories || [DEFAULT_CATEGORY];

  const [formData, setFormData] = useState<Part>({
    id: 0,
    sku: '',
    name: '',
    category: DEFAULT_CATEGORY,
    qualityRate: 99.0,
    stock: 0,
    status: 'Active',
  });

  useEffect(() => {
    if (part) {
      setFormData({
        ...part,
        category: part.category || DEFAULT_CATEGORY
      });
    } else {
      // Reset form for new part
      setFormData({
        id: 0,
        sku: '',
        name: '',
        category: DEFAULT_CATEGORY,
        qualityRate: 99.0,
        stock: 0,
        status: 'Active',
      });
    }
  }, [part]);

  const handleChange = (field: keyof Part, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(`Part ${part ? 'updated' : 'added'} successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{part ? 'Edit Part' : 'Add New Part'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                className="col-span-3"
              />
            </div>
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
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                value={formData.category} 
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
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'Active' | 'Low Stock' | 'Discontinued') => handleChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="qualityRate" className="text-right">
                Quality Rate %
              </Label>
              <Input
                id="qualityRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.qualityRate}
                onChange={(e) => handleChange('qualityRate', parseFloat(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value))}
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

export default PartEditModal;
