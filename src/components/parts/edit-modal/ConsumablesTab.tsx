
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FilterableSelect, SelectItem } from '@/components/ui/select';
import { Part } from '@/types/part';
import { Consumable } from '@/types/consumable';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

interface ConsumablesTabProps {
  part: Part;
  setPart: (part: Part) => void;
  consumables: Consumable[];
}

const ConsumablesTab = ({ part, setPart, consumables }: ConsumablesTabProps) => {
  const [consumableId, setConsumableId] = useState<string>("");
  const [consumableAmount, setConsumableAmount] = useState<number>(0);

  const handleAddConsumable = () => {
    const amount = Number(consumableAmount);
    
    if (!consumableId || isNaN(amount) || amount <= 0) {
      toast.error("Please select a consumable and specify a valid amount");
      return;
    }

    if (part.consumables.some(c => c.consumableId === consumableId)) {
      toast.error("This consumable is already added to the part");
      return;
    }

    setPart(prev => ({
      ...prev,
      consumables: [
        ...prev.consumables,
        { consumableId, amount }
      ]
    }));

    setConsumableId("");
    setConsumableAmount(0);
  };

  const handleRemoveConsumable = (consumableId: string) => {
    setPart(prev => ({
      ...prev,
      consumables: prev.consumables.filter(c => c.consumableId !== consumableId)
    }));
  };

  return (
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
              <SelectItem key={consumable.id} value={consumable.id}>
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

      {part.consumables.length > 0 ? (
        <div className="divide-y border rounded-md">
          {part.consumables.map(c => {
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
  );
};

export default ConsumablesTab;
