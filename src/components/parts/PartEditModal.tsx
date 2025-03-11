
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, FilterableSelect } from '@/components/ui/select';
import { toast } from 'sonner';
import { Part } from '@/types/part';
import { DEFAULT_CATEGORY } from '@/components/machines/CategoryManager';
import { useData } from '@/contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

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
  const { partCategories, consumables, rawMaterials } = useData();
  const categories = propCategories || partCategories || [DEFAULT_CATEGORY];

  const [formData, setFormData] = useState<Part>({
    id: 0,
    sku: '',
    name: '',
    category: DEFAULT_CATEGORY,
    qualityRate: 99.0,
    stock: 0,
    status: 'Active',
    consumables: [],
    rawMaterials: []
  });

  const [selectedTab, setSelectedTab] = useState('general');
  const [consumableId, setConsumableId] = useState('');
  const [consumableAmount, setConsumableAmount] = useState<number | ''>(0);
  const [rawMaterialId, setRawMaterialId] = useState('');
  const [rawMaterialAmount, setRawMaterialAmount] = useState<number | ''>(0);

  useEffect(() => {
    if (part) {
      setFormData({
        ...part,
        category: part.category || DEFAULT_CATEGORY,
        consumables: part.consumables || [],
        rawMaterials: part.rawMaterials || []
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
        consumables: [],
        rawMaterials: []
      });
    }
  }, [part]);

  const handleChange = (field: keyof Part, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddConsumable = () => {
    if (!consumableId || consumableAmount <= 0) {
      toast.error("Please select a consumable and specify a valid amount");
      return;
    }

    const conId = parseInt(consumableId);
    
    // Check if this consumable is already added
    if (formData.consumables.some(c => c.consumableId === conId)) {
      toast.error("This consumable is already added");
      return;
    }

    setFormData(prev => ({
      ...prev,
      consumables: [
        ...prev.consumables,
        { consumableId: conId, amount: Number(consumableAmount) }
      ]
    }));

    setConsumableId('');
    setConsumableAmount('');
  };

  const handleRemoveConsumable = (consumableId: number) => {
    setFormData(prev => ({
      ...prev,
      consumables: prev.consumables.filter(c => c.consumableId !== consumableId)
    }));
  };

  const handleAddRawMaterial = () => {
    if (!rawMaterialId || rawMaterialAmount <= 0) {
      toast.error("Please select a raw material and specify a valid amount");
      return;
    }

    const matId = parseInt(rawMaterialId);
    
    // Check if this raw material is already added
    if (formData.rawMaterials.some(m => m.rawMaterialId === matId)) {
      toast.error("This raw material is already added");
      return;
    }

    setFormData(prev => ({
      ...prev,
      rawMaterials: [
        ...prev.rawMaterials,
        { rawMaterialId: matId, amount: Number(rawMaterialAmount) }
      ]
    }));

    setRawMaterialId('');
    setRawMaterialAmount('');
  };

  const handleRemoveRawMaterial = (rawMaterialId: number) => {
    setFormData(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter(m => m.rawMaterialId !== rawMaterialId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(`Part ${part ? 'updated' : 'added'} successfully`);
  };

  const getConsumableName = (id: number) => {
    const consumable = consumables.find(c => c.id === id);
    return consumable ? consumable.name : `Consumable ${id}`;
  };

  const getConsumableUnit = (id: number) => {
    const consumable = consumables.find(c => c.id === id);
    return consumable ? consumable.unit : '';
  };

  const getRawMaterialName = (id: number) => {
    const material = rawMaterials.find(m => m.id === id);
    return material ? material.name : `Material ${id}`;
  };

  const getRawMaterialUnit = (id: number) => {
    const material = rawMaterials.find(m => m.id === id);
    return material ? material.unit : '';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{part ? 'Edit Part' : 'Add New Part'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="consumables">Consumables</TabsTrigger>
              <TabsTrigger value="rawMaterials">Raw Materials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
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
                  <FilterableSelect 
                    value={formData.category} 
                    onValueChange={(value) => handleChange('category', value)}
                    triggerClassName="col-span-3"
                  >
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </FilterableSelect>
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
                    value={formData.qualityRate || ''}
                    onChange={(e) => handleChange('qualityRate', parseFloat(e.target.value) || 0)}
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
                    value={formData.stock || ''}
                    onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="consumables">
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <Label htmlFor="consumable">Consumable</Label>
                    <FilterableSelect 
                      value={consumableId} 
                      onValueChange={setConsumableId}
                    >
                      {consumables.map((consumable) => (
                        <SelectItem key={consumable.id} value={consumable.id.toString()}>
                          {consumable.name} ({consumable.unit})
                        </SelectItem>
                      ))}
                    </FilterableSelect>
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={consumableAmount === 0 ? '' : consumableAmount}
                      onChange={(e) => setConsumableAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <Button 
                      type="button" 
                      onClick={handleAddConsumable}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Added Consumables</h3>
                  {formData.consumables.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No consumables added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.consumables.map((con) => (
                        <div key={con.consumableId} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                          <div>
                            <span className="font-medium">{getConsumableName(con.consumableId)}</span>
                            <Badge variant="outline" className="ml-2">
                              {con.amount} {getConsumableUnit(con.consumableId)}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveConsumable(con.consumableId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rawMaterials">
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <Label htmlFor="rawMaterial">Raw Material</Label>
                    <FilterableSelect 
                      value={rawMaterialId} 
                      onValueChange={setRawMaterialId}
                    >
                      {rawMaterials.map((material) => (
                        <SelectItem key={material.id} value={material.id.toString()}>
                          {material.name} ({material.unit})
                        </SelectItem>
                      ))}
                    </FilterableSelect>
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={rawMaterialAmount === 0 ? '' : rawMaterialAmount}
                      onChange={(e) => setRawMaterialAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <Button 
                      type="button" 
                      onClick={handleAddRawMaterial}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Added Raw Materials</h3>
                  {formData.rawMaterials.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No raw materials added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.rawMaterials.map((mat) => (
                        <div key={mat.rawMaterialId} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                          <div>
                            <span className="font-medium">{getRawMaterialName(mat.rawMaterialId)}</span>
                            <Badge variant="outline" className="ml-2">
                              {mat.amount} {getRawMaterialUnit(mat.rawMaterialId)}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveRawMaterial(mat.rawMaterialId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
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
