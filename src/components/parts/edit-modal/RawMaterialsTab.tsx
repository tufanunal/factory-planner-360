
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FilterableSelect, SelectItem } from '@/components/ui/select';
import { Part } from '@/types/part';
import { RawMaterial } from '@/types/rawMaterial';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

interface RawMaterialsTabProps {
  part: Part;
  setPart: (part: Part) => void;
  rawMaterials: RawMaterial[];
}

const RawMaterialsTab = ({ part, setPart, rawMaterials }: RawMaterialsTabProps) => {
  const [rawMaterialId, setRawMaterialId] = useState<string>("");
  const [rawMaterialAmount, setRawMaterialAmount] = useState<number>(0);

  const handleAddRawMaterial = () => {
    const amount = Number(rawMaterialAmount);
    
    if (!rawMaterialId || isNaN(amount) || amount <= 0) {
      toast.error("Please select a raw material and specify a valid amount");
      return;
    }

    if (part.rawMaterials.some(r => r.rawMaterialId === rawMaterialId)) {
      toast.error("This raw material is already added to the part");
      return;
    }

    // Create a new part object with the updated rawMaterials array
    const updatedPart = {
      ...part,
      rawMaterials: [
        ...part.rawMaterials,
        { rawMaterialId, amount }
      ]
    };
    
    // Update the part with the new object
    setPart(updatedPart);

    setRawMaterialId("");
    setRawMaterialAmount(0);
  };

  const handleRemoveRawMaterial = (rawMaterialId: string) => {
    // Create a new part object with the filtered rawMaterials array
    const updatedPart = {
      ...part,
      rawMaterials: part.rawMaterials.filter(r => r.rawMaterialId !== rawMaterialId)
    };
    
    // Update the part with the new object
    setPart(updatedPart);
  };

  return (
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
              <SelectItem key={rawMaterial.id} value={rawMaterial.id}>
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

      {part.rawMaterials.length > 0 ? (
        <div className="divide-y border rounded-md">
          {part.rawMaterials.map(r => {
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
  );
};

export default RawMaterialsTab;
