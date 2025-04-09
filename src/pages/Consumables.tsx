
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Search, Filter, Plus, Trash2, Pencil } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Consumable } from '@/types/consumable';
import UnitManager from '@/components/common/UnitManager';
import ConsumableEditModal from '@/components/consumables/ConsumableEditModal';
import { toast } from 'sonner';

const ConsumablesPage = () => {
  const { consumables, units, addConsumable, updateConsumable, removeConsumable } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null);

  const filteredConsumables = consumables.filter(consumable => 
    consumable.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (consumable: Consumable | null = null) => {
    setSelectedConsumable(consumable);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedConsumable(null);
    setIsModalOpen(false);
  };

  const handleSaveConsumable = async (consumable: Consumable) => {
    try {
      if (!consumable.id) {
        // For new consumables
        await addConsumable(consumable);
        toast.success("Consumable added successfully");
      } else {
        // For existing consumables
        await updateConsumable(consumable.id, consumable);
        toast.success("Consumable updated successfully");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving consumable:", error);
      toast.error("Failed to save consumable");
    }
  };

  const handleDeleteConsumable = async (consumableId: string) => {
    try {
      await removeConsumable(consumableId);
      toast.success("Consumable removed successfully");
    } catch (error) {
      console.error("Error removing consumable:", error);
      toast.error("Failed to remove consumable");
    }
  };

  return (
    <DashboardLayout 
      title="Consumables" 
      description="Manage and track consumables for production"
    >
      <div className="space-y-6">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Consumables Manager
            </CardTitle>
            <CardDescription>
              Track and manage all consumables used in production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search consumables by name..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => handleOpenModal()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Consumable
              </Button>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <UnitManager />
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-7 py-3 px-4 bg-muted/50 text-sm font-medium">
                <div className="col-span-2">Consumable</div>
                <div className="col-span-1">Unit</div>
                <div className="col-span-1 text-right">Cost/Unit</div>
                <div className="col-span-1 text-right">Stock</div>
                <div className="col-span-1 text-right">Total Value</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              <div className="divide-y">
                {filteredConsumables.length > 0 ? (
                  filteredConsumables.map((consumable) => (
                    <div key={consumable.id} className="grid grid-cols-7 py-3 px-4 items-center">
                      <div className="col-span-2">
                        <div className="font-medium">{consumable.name}</div>
                      </div>
                      <div className="col-span-1">
                        <Badge variant="outline">{consumable.unit}</Badge>
                      </div>
                      <div className="col-span-1 text-right">
                        €{consumable.costPerUnit.toFixed(2)}
                      </div>
                      <div className="col-span-1 text-right font-medium">
                        {consumable.stock} {consumable.unit}
                      </div>
                      <div className="col-span-1 text-right font-medium">
                        €{(consumable.costPerUnit * consumable.stock).toFixed(2)}
                      </div>
                      <div className="col-span-1 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenModal(consumable)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteConsumable(consumable.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No consumables found matching your search.
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <div>Showing {filteredConsumables.length} of {consumables.length} consumables</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConsumableEditModal
        consumable={selectedConsumable}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveConsumable}
        units={units}
      />
    </DashboardLayout>
  );
};

export default ConsumablesPage;
