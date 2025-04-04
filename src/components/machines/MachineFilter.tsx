
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MachineFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const MachineFilter: React.FC<MachineFilterProps> = ({ 
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <Tabs 
      defaultValue={selectedCategory || "all"} 
      className="w-full"
      onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
    >
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
