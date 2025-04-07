
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Part } from '@/types/part';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Package, Layers } from 'lucide-react';

// Import the tab components
import DetailTab from './edit-modal/DetailTab';
import ConsumablesTab from './edit-modal/ConsumablesTab';
import RawMaterialsTab from './edit-modal/RawMaterialsTab';

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
      id: '',
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
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (part) {
      setEditedPart(part);
    } else {
      setEditedPart({
        id: '',
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
          
          <TabsContent value="details">
            <DetailTab 
              part={editedPart} 
              setPart={setEditedPart} 
              categories={categories} 
            />
          </TabsContent>
          
          <TabsContent value="consumables">
            <ConsumablesTab 
              part={editedPart} 
              setPart={setEditedPart} 
              consumables={consumables} 
            />
          </TabsContent>
          
          <TabsContent value="rawMaterials">
            <RawMaterialsTab 
              part={editedPart} 
              setPart={setEditedPart} 
              rawMaterials={rawMaterials} 
            />
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
