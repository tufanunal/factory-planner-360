import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterableSelect, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Part } from '@/types/part';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Package, Layers, Box } from 'lucide-react';

interface PartEditModalProps {
  part: Part | null;
  open: boolean;
  onClose: () => void;
  onSave: (part: Part) => void;
  categories: string[];
}

const PartEditModal = ({
  part,
  open,
  onClose,
  onSave,
  categories,
}: PartEditModalProps) => {
  const { consumables, rawMaterials } = useData();
  const [editedPart, setEditedPart] = useState<Part>(
    part || {
      id: 0,
      name: '',
      sku: '',
      description: '',
      category: categories[0] || '',
      qualityRate: 100,
      stock: 0,
      status: 'Active',
      consumables: [],
      rawMaterials: []
    }
  );
  const [consumableId, setConsumableId] = useState<string>("");
  const [consumableAmount, setConsumableAmount] = useState<number>(0);
  const [rawMaterialId, setRawMaterialId] = useState<string>("");
  const [rawMaterialAmount, setRawMaterialAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (part) {
      setEditedPart(part);
    } else {
      setEditedPart({
        id: 0,
        name: '',
        sku: '',
        description: '',
        category: categories[0] || '',
        qualityRate: 100,
        stock: 0,
        status: 'Active',
        consumables: [],
        rawMaterials: []
      });
    }
    setActiveTab("details");
  }, [part, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPart(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedPart(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddConsumable = () => {
    const amount = Number(consumableAmount);
    const conId = Number(consumableId);
    
    if (!consumableId || isNaN(amount) || amount <= 0) {
      toast.error("Please select a consumable and specify a valid amount");
      return;
    }

    if (editedPart.consumables.some(c => c.consumableId === conId)) {
      toast.error("This consumable is already added to the part");
      return;
    }

    setEditedPart(prev => ({
      ...prev,
      consumables: [
        ...prev.consumables,
        { consumableId: conId, amount }
      ]
    }));

    setConsumableId("");
    setConsumableAmount(0);
  };

  const handleAddRawMaterial = () => {
    const amount = Number(rawMaterialAmount);
    const matId = Number(rawMaterialId);
    
    if (!rawMaterialId || isNaN(amount) || amount <= 0) {
      toast.error("Please select a raw material and specify a valid amount");
      return;
    }

    if (editedPart.rawMaterials.some(r => r.rawMaterialId === matId)) {
      toast.error("This raw material is already added to the part");
      return;
    }

    setEditedPart(prev => ({
      ...prev,
      rawMaterials: [
        ...prev.rawMaterials,
        { rawMaterialId: matId, amount }
      ]
    }));

    setRawMaterialId("");
    setRawMaterialAmount(0);
  };

  const handleRemoveConsumable = (consumableId: number) => {
    setEditedPart(prev => ({
      ...prev,
      consumables: prev.consumables.filter(c => c.consumableId !== consumableId)
    }));
  };

  const handleRemoveRawMaterial = (rawMaterialId: number) => {
    setEditedPart(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter(r => r.rawMaterialId !== rawMaterialId)
    }));
  };

  const handleSave = () => {
    if (!editedPart.name || !editedPart.sku || !editedPart.category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    onSave(editedPart);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{part ? 'Edit Part' : 'Add Part'}</DialogTitle>
          <DialogDescription>
            {part ? 'Edit part details and save changes.' : 'Create a new part by entering the details below.'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Box size={16} />
              Details
            </TabsTrigger>
            <TabsTrigger value="consumables" className="flex items-center gap-2">
              <Package size={16} />
              Consumables
            </TabsTrigger>
            <TabsTrigger value="rawMaterials" className="flex items-center gap-2">
              <Layers size={16} />
              Raw Materials
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={editedPart.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                type="text"
                id="sku"
                name="sku"
                value={editedPart.sku}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <FilterableSelect 
                value={editedPart.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
                triggerClassName="col-span-3"
              >
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </FilterableSelect>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="qualityRate" className="text-right">
                Quality Rate
              </Label>
              <Input
                type="number"
                id="qualityRate"
                name="qualityRate"
                value={editedPart.qualityRate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={editedPart.stock}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={editedPart.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
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
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={editedPart.description || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="consumables">
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="consumable" className="mb-2 block">Consumable</Label>
                  <FilterableSelect
                    value={consumableId}
                    onValueChange={setConsumableId}
                    placeholder="Select Consumable"
                  >
                    {consumables.map(consumable => (
                      <SelectItem key={consumable.id} value={consumable.id.toString()}>
                        {consumable.name}
                      </SelectItem>
                    ))}
                  </FilterableSelect>
                </div>
                <div className="w-24">
                  <Label htmlFor="amount" className="mb-2 block">Amount</Label>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="Amount"
                    value={consumableAmount}
                    onChange={(e) => setConsumableAmount(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleAddConsumable} className="flex items-center gap-1">
                  <Plus size={16} /> Add
                </Button>
              </div>

              {editedPart.consumables.length > 0 ? (
                <div className="divide-y border rounded-md">
                  {editedPart.consumables.map(c => {
                    const actualConsumable = consumables.find(cons => cons.id === c.consumableId);
                    return actualConsumable ? (
                      <div key={c.consumableId} className="flex items-center justify-between p-3">
                        <div>
                          <span className="font-medium">{actualConsumable.name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">Amount: {c.amount}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveConsumable(c.consumableId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-md">
                  No consumables added yet
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rawMaterials">
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="rawMaterial" className="mb-2 block">Raw Material</Label>
                  <FilterableSelect
                    value={rawMaterialId}
                    onValueChange={setRawMaterialId}
                    placeholder="Select Raw Material"
                  >
                    {rawMaterials.map(rawMaterial => (
                      <SelectItem key={rawMaterial.id} value={rawMaterial.id.toString()}>
                        {rawMaterial.name}
                      </SelectItem>
                    ))}
                  </FilterableSelect>
                </div>
                <div className="w-24">
                  <Label htmlFor="amount" className="mb-2 block">Amount</Label>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="Amount"
                    value={rawMaterialAmount}
                    onChange={(e) => setRawMaterialAmount(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleAddRawMaterial} className="flex items-center gap-1">
                  <Plus size={16} /> Add
                </Button>
              </div>

              {editedPart.rawMaterials.length > 0 ? (
                <div className="divide-y border rounded-md">
                  {editedPart.rawMaterials.map(r => {
                    const actualRawMaterial = rawMaterials.find(rm => rm.id === r.rawMaterialId);
                    return actualRawMaterial ? (
                      <div key={r.rawMaterialId} className="flex items-center justify-between p-3">
                        <div>
                          <span className="font-medium">{actualRawMaterial.name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">Amount: {r.amount}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveRawMaterial(r.rawMaterialId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-md">
                  No raw materials added yet
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartEditModal;
