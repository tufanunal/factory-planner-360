import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

import CategoryForm from './CategoryForm';
import CategoryItem from './CategoryItem';

// Default category that cannot be deleted
export const DEFAULT_PART_CATEGORY = 'Uncategorized';

interface PartCategoryManagerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PartCategoryManager = ({ 
  open, 
  onOpenChange 
}: PartCategoryManagerProps) => {
  const { partCategories, setPartCategories, parts, setParts } = useData();
  const [localCategories, setLocalCategories] = useState<string[]>([]);

  // Initialize local categories from context
  useEffect(() => {
    setLocalCategories([...partCategories]);
  }, [partCategories]);

  const handleAddCategory = (newCategory: string) => {
    const updatedCategories = [...localCategories, newCategory];
    setLocalCategories(updatedCategories);
    setPartCategories(updatedCategories);
  };

  const handleEditCategory = (index: number, newName: string) => {
    if (localCategories.includes(newName) && newName !== localCategories[index]) {
      toast.error('Category already exists');
      return;
    }
    
    const oldCategory = localCategories[index];
    const updatedCategories = [...localCategories];
    updatedCategories[index] = newName;
    
    setLocalCategories(updatedCategories);
    setPartCategories(updatedCategories);

    // Update parts that use the old category
    const updatedParts = parts.map(part => {
      if (part.category === oldCategory) {
        return { ...part, category: newName };
      }
      return part;
    });
    
    if (updatedParts.some(part => part.category === newName && part.category !== oldCategory)) {
      setParts(updatedParts);
      toast.info(`Updated category for ${updatedParts.filter(p => p.category === newName && p.category !== oldCategory).length} parts`);
    }
    
    toast.success('Category updated successfully');
  };

  const handleDeleteCategory = (index: number) => {
    if (localCategories[index] === DEFAULT_PART_CATEGORY) {
      toast.error('Cannot delete the default category');
      return;
    }
    
    const categoryToDelete = localCategories[index];
    const updatedCategories = localCategories.filter((_, i) => i !== index);
    
    setLocalCategories(updatedCategories);
    setPartCategories(updatedCategories);

    // Update parts using the deleted category to use the default category
    const partsToUpdate = parts.filter(part => part.category === categoryToDelete);
    if (partsToUpdate.length > 0) {
      const updatedParts = parts.map(part => {
        if (part.category === categoryToDelete) {
          return { ...part, category: DEFAULT_PART_CATEGORY };
        }
        return part;
      });
      
      setParts(updatedParts);
      toast.info(`${partsToUpdate.length} parts were reverted to ${DEFAULT_PART_CATEGORY} category`);
    }
    
    toast.success('Category deleted successfully');
  };

  // Content to display regardless of whether it's in a dialog or not
  const categoryManagerContent = (
    <div className="space-y-4">
      <CategoryForm 
        categories={localCategories}
        onAddCategory={handleAddCategory}
      />
      
      <div className="space-y-2">
        {localCategories.map((category, index) => (
          <CategoryItem
            key={index}
            category={category}
            index={index}
            defaultCategory={DEFAULT_PART_CATEGORY}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>
    </div>
  );

  // If open and onOpenChange props are provided, render as a dialog
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Part Categories</DialogTitle>
            <DialogDescription>
              Manage and organize part categories. The default category cannot be modified.
              Changes will be applied to all parts using these categories.
            </DialogDescription>
          </DialogHeader>
          {categoryManagerContent}
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise, render as a regular card
  return (
    <Card>
      <CardHeader>
        <CardTitle>Part Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryManagerContent}
      </CardContent>
    </Card>
  );
};

export default PartCategoryManager;
