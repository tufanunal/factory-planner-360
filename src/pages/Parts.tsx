
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Box } from 'lucide-react';
import { Part } from '@/types/part';
import PartCard from '@/components/parts/PartCard';
import PartEditModal from '@/components/parts/PartEditModal';
import PartCategoryManager from '@/components/parts/PartCategoryManager';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import PartFilters from '@/components/parts/PartFilters';
import PartTable from '@/components/parts/PartTable';
import PartPagination from '@/components/parts/PartPagination';
import PartMetrics from '@/components/parts/PartMetrics';

const PartsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  
  const { parts, setParts, partCategories } = useData();
  
  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    part.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (part: Part | null = null) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPart(null);
    setIsModalOpen(false);
  };

  const handleSavePart = (part: Part) => {
    if (part.id === '') {
      const newPart = {
        ...part,
        id: Math.random().toString(36).substring(2, 15)
      };
      setParts([...parts, newPart]);
    } else {
      setParts(parts.map(p => p.id === part.id ? part : p));
    }
    handleCloseModal();
  };

  const handleDeletePart = (partId: string) => {
    setParts(parts.filter(p => p.id !== partId));
    toast.success("Part removed successfully");
  };

  return (
    <DashboardLayout 
      title="Parts" 
      description="Manage parts inventory and quality metrics"
    >
      <div className="space-y-6">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Box className="mr-2 h-5 w-5" />
              Parts Manager
            </CardTitle>
            <CardDescription>
              Track and manage all parts and their quality metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PartFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddPart={() => handleOpenModal()}
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
            />
            
            <PartTable 
              parts={filteredParts} 
              onEdit={handleOpenModal} 
              onDelete={handleDeletePart} 
            />
            
            <PartPagination 
              totalCount={parts.length} 
              filteredCount={filteredParts.length} 
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up [animation-delay:100ms]">
          {filteredParts.map(part => (
            <PartCard 
              key={part.id} 
              part={part} 
              onEdit={handleOpenModal} 
            />
          ))}
        </div>

        <PartMetrics />
      </div>

      <PartEditModal
        part={selectedPart}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePart}
        categories={partCategories}
      />

      <PartCategoryManager
        open={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
      />
    </DashboardLayout>
  );
};

export default PartsPage;
