
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus } from 'lucide-react';

interface PartFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddPart: () => void;
  onOpenCategoryManager: () => void;
}

const PartFilters = ({ 
  searchQuery, 
  onSearchChange, 
  onAddPart, 
  onOpenCategoryManager 
}: PartFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search parts by name, SKU or category..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        className="flex items-center"
        onClick={onAddPart}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Part
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center"
        onClick={onOpenCategoryManager}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4"
        >
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
          <path d="M7 7h.01" />
        </svg>
        Categories
      </Button>
      <Button variant="outline" className="flex items-center">
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>
    </div>
  );
};

export default PartFilters;
