
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

export const DEFAULT_UNIT = 'pcs';

const UnitManager = () => {
  const { units, setUnits } = useData();
  const [newUnit, setNewUnit] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddUnit = () => {
    const trimmedUnit = newUnit.trim();
    
    if (!trimmedUnit) {
      toast.error("Unit name cannot be empty");
      return;
    }
    
    if (units.includes(trimmedUnit)) {
      toast.error("This unit already exists");
      return;
    }
    
    setUnits([...units, trimmedUnit]);
    setNewUnit('');
    toast.success("Unit added successfully");
  };

  const handleDeleteUnit = (unitToDelete: string) => {
    if (unitToDelete === DEFAULT_UNIT) {
      toast.error(`Cannot delete the default unit "${DEFAULT_UNIT}"`);
      return;
    }
    
    setUnits(units.filter(unit => unit !== unitToDelete));
    toast.success("Unit deleted successfully");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddUnit();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Manage Units
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Manage Units</SheetTitle>
          <SheetDescription>
            Add or remove units for consumables and raw materials.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter new unit..."
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow"
            />
            <Button onClick={handleAddUnit} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Available Units</h3>
            <div className="flex flex-wrap gap-2">
              {units.map((unit) => (
                <Badge key={unit} variant="secondary" className="gap-1 py-1.5">
                  {unit}
                  <button
                    onClick={() => handleDeleteUnit(unit)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    disabled={unit === DEFAULT_UNIT}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Delete</span>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UnitManager;
