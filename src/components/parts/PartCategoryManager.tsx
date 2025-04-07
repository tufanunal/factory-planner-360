import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Pencil, Trash2, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

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
  
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [localCategories, setLocalCategories] = useState<string[]>([]);

  // Initialize local categories from context
  useEffect(() => {
    setLocalCategories([...partCategories]);
  }, [partCategories]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    if (localCategories.includes(newCategory)) {
      toast.error('Category already exists');
      return;
    }
    
    const updatedCategories = [...localCategories, newCategory];
    setLocalCategories(updatedCategories);
    setPartCategories(updatedCategories);
    
    setNewCategory('');
    toast.success('Category added successfully');
  };

  const startEditing = (index: number) => {
    if (localCategories[index] === DEFAULT_PART_CATEGORY) {
      toast.error('Cannot edit the default category');
      return;
    }
    setEditingIndex(index);
    setEditValue(localCategories[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const saveEditing = async (index: number) => {
    if (!editValue.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    if (localCategories.includes(editValue) && editValue !== localCategories[index]) {
      toast.error('Category already exists');
      return;
    }
    
    const oldCategory = localCategories[index];
    const updatedCategories = [...localCategories];
    updatedCategories[index] = editValue;
    
    setLocalCategories(updatedCategories);
    setPartCategories(updatedCategories);

    // Update parts that use the old category
    const updatedParts = parts.map(part => {
      if (part.category === oldCategory) {
        return { ...part, category: editValue };
      }
      return part;
    });
    
    if (updatedParts.some(part => part.category === editValue && part.category !== oldCategory)) {
      setParts(updatedParts);
      toast.info(`Updated category for ${updatedParts.filter(p => p.category === editValue && p.category !== oldCategory).length} parts`);
    }
    
    setEditingIndex(null);
    setEditValue('');
    toast.success('Category updated successfully');
  };

  const handleDeleteCategory = async (index: number) => {
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
      <div className="flex items-center gap-2">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={handleAddCategory}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      
      <div className="space-y-2">
        {localCategories.map((category, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-2 border rounded-md"
          >
            {editingIndex === index ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={() => saveEditing(index)}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span>{category}</span>
                  {category === DEFAULT_PART_CATEGORY && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-600">Default</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => startEditing(index)}
                    disabled={category === DEFAULT_PART_CATEGORY}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteCategory(index)}
                    disabled={category === DEFAULT_PART_CATEGORY}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
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
