
import { Button } from '@/components/ui/button';

interface PartPaginationProps {
  totalCount: number;
  filteredCount: number;
}

const PartPagination = ({ totalCount, filteredCount }: PartPaginationProps) => {
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
      <div>Showing {filteredCount} of {totalCount} parts</div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>Previous</Button>
        <Button variant="outline" size="sm" disabled>Next</Button>
      </div>
    </div>
  );
};

export default PartPagination;
