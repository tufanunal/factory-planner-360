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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Part } from '@/types/part';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { ScrollArea } from "@/components/ui/scroll-area"

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

  useEffect(() => {
    setEditedPart(
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

  // Fix the error with string | number comparison by ensuring numeric types
  const handleAddConsumable = () => {
    const amount = Number(consumableAmount);
    if (!consumableId || isNaN(amount) || amount <= 0) {
      toast.error("Please select a consumable and specify a valid amount");
      return;
    }

    // Find the selected consumable
    const selectedConsumable = consumables.find(c => c.id === Number(consumableId));
    if (!selectedConsumable) return;

    // Convert ID to number to ensure it's consistent
    const conId = Number(consumableId);

    // Add the consumable to the part
    setEditedPart(prev => ({
      ...prev,
      consumables: [
        ...prev.consumables,
        { consumableId: conId, amount }
      ]
    }));

    // Reset the form
    setConsumableId("");
    setConsumableAmount(0);
  };

  // Fix the error with string | number comparison by ensuring numeric types
  const handleAddRawMaterial = () => {
    const amount = Number(rawMaterialAmount);
    if (!rawMaterialId || isNaN(amount) || amount <= 0) {
      toast.error("Please select a raw material and specify a valid amount");
      return;
    }

    // Find the selected raw material
    const selectedRawMaterial = rawMaterials.find(r => r.id === Number(rawMaterialId));
    if (!selectedRawMaterial) return;

    // Convert ID to number to ensure it's consistent
    const matId = Number(rawMaterialId);

    // Add the raw material to the part
    setEditedPart(prev => ({
      ...prev,
      rawMaterials: [
        ...prev.rawMaterials,
        { rawMaterialId: matId, amount }
      ]
    }));

    // Reset the form
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
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{part ? 'Edit Part' : 'Add Part'}</DialogTitle>
          <DialogDescription>
            {part ? 'Edit part details and save changes.' : 'Create a new part by entering the details below.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            <Select onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" defaultValue={editedPart.category} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" defaultValue={editedPart.status} />
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
              value={editedPart.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Consumables */}
          <div className="border-t pt-4">
            <h4 className="text-md font-semibold">Consumables</h4>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label htmlFor="consumable" className="text-right">
                Add Consumable
              </Label>
              <Select onValueChange={setConsumableId}>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select Consumable" />
                </SelectTrigger>
                <SelectContent>
                  {consumables.map(consumable => (
                    <SelectItem key={consumable.id} value={consumable.id.toString()}>
                      {consumable.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={consumableAmount}
                onChange={(e) => setConsumableAmount(Number(e.target.value))}
              />
            </div>
            <Button variant="outline" className="mt-2 w-full" onClick={handleAddConsumable}>
              Add Consumable
            </Button>

            {editedPart.consumables.length > 0 && (
              <ScrollArea className="h-40 mt-4 rounded-md border">
                <div className="divide-y">
                  {editedPart.consumables.map(consumable => {
                    const actualConsumable = consumables.find(c => c.id === consumable.consumableId);
                    return actualConsumable ? (
                      <div key={consumable.consumableId} className="flex items-center justify-between p-2">
                        <span>{actualConsumable.name} - Amount: {consumable.amount}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveConsumable(consumable.consumableId)}>
                          Remove
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Raw Materials */}
          <div className="border-t pt-4">
            <h4 className="text-md font-semibold">Raw Materials</h4>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label htmlFor="rawMaterial" className="text-right">
                Add Raw Material
              </Label>
              <Select onValueChange={setRawMaterialId}>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select Raw Material" />
                </SelectTrigger>
                <SelectContent>
                  {rawMaterials.map(rawMaterial => (
                    <SelectItem key={rawMaterial.id} value={rawMaterial.id.toString()}>
                      {rawMaterial.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={rawMaterialAmount}
                onChange={(e) => setRawMaterialAmount(Number(e.target.value))}
              />
            </div>
            <Button variant="outline" className="mt-2 w-full" onClick={handleAddRawMaterial}>
              Add Raw Material
            </Button>

            {editedPart.rawMaterials.length > 0 && (
              <ScrollArea className="h-40 mt-4 rounded-md border">
                <div className="divide-y">
                  {editedPart.rawMaterials.map(rawMaterial => {
                    const actualRawMaterial = rawMaterials.find(r => r.id === rawMaterial.rawMaterialId);
                    return actualRawMaterial ? (
                      <div key={rawMaterial.rawMaterialId} className="flex items-center justify-between p-2">
                        <span>{actualRawMaterial.name} - Amount: {rawMaterial.amount}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRawMaterial(rawMaterial.rawMaterialId)}>
                          Remove
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
        <DialogFooter>
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
