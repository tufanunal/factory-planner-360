
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PartPaginationProps {
  totalCount: number;
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const PartPagination = ({ 
  totalCount, 
  filteredCount, 
  currentPage, 
  itemsPerPage, 
  onPageChange 
}: PartPaginationProps) => {
  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;
  
  const startItem = filteredCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filteredCount);
  
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
      <div>
        {filteredCount > 0 
          ? `Showing ${startItem}-${endItem} of ${filteredCount} parts` 
          : `Showing 0 of ${totalCount} parts`}
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage || filteredCount === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage || filteredCount === 0}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PartPagination;
