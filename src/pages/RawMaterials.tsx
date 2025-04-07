
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Box, Search, Filter, Plus, Trash2, Pencil } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { RawMaterial } from '@/types/rawMaterial';
import UnitManager from '@/components/common/UnitManager';
import RawMaterialEditModal from '@/components/rawMaterials/RawMaterialEditModal';
import { toast } from 'sonner';
import DbStructureViewer from '@/components/machines/DbStructureViewer';

const RawMaterialsPage = () => {
  const { rawMaterials, addRawMaterial, updateRawMaterial, removeRawMaterial, units } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState<RawMaterial | null>(null);

  const filteredRawMaterials = rawMaterials.filter(rawMaterial => 
    rawMaterial.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (rawMaterial: RawMaterial | null = null) => {
    setSelectedRawMaterial(rawMaterial);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRawMaterial(null);
    setIsModalOpen(false);
  };

  const handleSaveRawMaterial = async (rawMaterial: RawMaterial) => {
    try {
      if (!rawMaterial.id) {
        // For new raw materials
        await addRawMaterial(rawMaterial);
        toast.success("Raw material added successfully");
      } else {
        // For existing raw materials
        await updateRawMaterial(rawMaterial.id, rawMaterial);
        toast.success("Raw material updated successfully");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving raw material:", error);
      toast.error("Failed to save raw material");
    }
  };

  const handleDeleteRawMaterial = async (rawMaterialId: string) => {
    try {
      await removeRawMaterial(rawMaterialId);
      toast.success("Raw material removed successfully");
    } catch (error) {
      console.error("Error removing raw material:", error);
      toast.error("Failed to remove raw material");
    }
  };

  return (
    <DashboardLayout 
      title="Raw Materials" 
      description="Manage and track raw materials for production"
    >
      <div className="space-y-6">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Box className="mr-2 h-5 w-5" />
              Raw Materials Manager
            </CardTitle>
            <CardDescription>
              Track and manage all raw materials used in production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search raw materials by name..."
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
                Add Raw Material
              </Button>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <UnitManager />
              <DbStructureViewer />
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-7 py-3 px-4 bg-muted/50 text-sm font-medium">
                <div className="col-span-2">Raw Material</div>
                <div className="col-span-1">Unit</div>
                <div className="col-span-1 text-right">Cost/Unit</div>
                <div className="col-span-1 text-right">Stock</div>
                <div className="col-span-1 text-right">Total Value</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              <div className="divide-y">
                {filteredRawMaterials.length > 0 ? (
                  filteredRawMaterials.map((rawMaterial) => (
                    <div key={rawMaterial.id} className="grid grid-cols-7 py-3 px-4 items-center">
                      <div className="col-span-2">
                        <div className="font-medium">{rawMaterial.name}</div>
                      </div>
                      <div className="col-span-1">
                        <Badge variant="outline">{rawMaterial.unit}</Badge>
                      </div>
                      <div className="col-span-1 text-right">
                        €{rawMaterial.costPerUnit.toFixed(2)}
                      </div>
                      <div className="col-span-1 text-right font-medium">
                        {rawMaterial.stock} {rawMaterial.unit}
                      </div>
                      <div className="col-span-1 text-right font-medium">
                        €{(rawMaterial.costPerUnit * rawMaterial.stock).toFixed(2)}
                      </div>
                      <div className="col-span-1 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenModal(rawMaterial)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteRawMaterial(rawMaterial.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No raw materials found matching your search.
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <div>Showing {filteredRawMaterials.length} of {rawMaterials.length} raw materials</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RawMaterialEditModal
        rawMaterial={selectedRawMaterial}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRawMaterial}
        units={units}
      />
    </DashboardLayout>
  );
};

export default RawMaterialsPage;
