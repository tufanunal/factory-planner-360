
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

const ITEMS_PER_PAGE = 10;

const PartsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { parts, setParts, partCategories } = useData();
  
  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    part.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate paginated parts
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedParts = filteredParts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      toast.success("Part added successfully");
    } else {
      setParts(parts.map(p => p.id === part.id ? part : p));
      toast.success("Part updated successfully");
    }
    handleCloseModal();
  };

  const handleDeletePart = (partId: string) => {
    setParts(parts.filter(p => p.id !== partId));
    toast.success("Part removed successfully");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset pagination when search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
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
              onSearchChange={handleSearchChange}
              onAddPart={() => handleOpenModal()}
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
            />
            
            <PartTable 
              parts={paginatedParts} 
              onEdit={handleOpenModal} 
              onDelete={handleDeletePart} 
            />
            
            <PartPagination 
              totalCount={parts.length} 
              filteredCount={filteredParts.length} 
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up [animation-delay:100ms]">
          {paginatedParts.map(part => (
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
