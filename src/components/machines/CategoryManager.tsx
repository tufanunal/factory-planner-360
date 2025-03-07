
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Pencil, Trash2, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Default category that cannot be deleted
export const DEFAULT_CATEGORY = 'Uncategorized';

interface CategoryManagerProps {
  onCategoryChange: (categories: string[]) => void;
  machines: any[]; // Machine type
}

const CategoryManager = ({ onCategoryChange, machines }: CategoryManagerProps) => {
  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('machineCategories');
    return savedCategories 
      ? JSON.parse(savedCategories) 
      : [DEFAULT_CATEGORY];
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('machineCategories', JSON.stringify(categories));
    onCategoryChange(categories);
  }, [categories, onCategoryChange]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    if (categories.includes(newCategory)) {
      toast.error('Category already exists');
      return;
    }
    
    setCategories([...categories, newCategory]);
    setNewCategory('');
    toast.success('Category added successfully');
  };

  const startEditing = (index: number) => {
    if (categories[index] === DEFAULT_CATEGORY) {
      toast.error('Cannot edit the default category');
      return;
    }
    setEditingIndex(index);
    setEditValue(categories[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const saveEditing = (index: number) => {
    if (!editValue.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    if (categories.includes(editValue) && editValue !== categories[index]) {
      toast.error('Category already exists');
      return;
    }
    
    const updatedCategories = [...categories];
    updatedCategories[index] = editValue;
    setCategories(updatedCategories);
    setEditingIndex(null);
    setEditValue('');
    toast.success('Category updated successfully');
  };

  const handleDeleteCategory = (index: number) => {
    if (categories[index] === DEFAULT_CATEGORY) {
      toast.error('Cannot delete the default category');
      return;
    }
    
    const categoryToDelete = categories[index];
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    
    // Check if any machines use this category and revert them to default
    const machinesUsingCategory = machines.filter(
      machine => machine.category === categoryToDelete
    );
    
    if (machinesUsingCategory.length > 0) {
      toast.info(`${machinesUsingCategory.length} machines were reverted to ${DEFAULT_CATEGORY} category`);
    }
    
    toast.success('Category deleted successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Machine Categories</CardTitle>
      </CardHeader>
      <CardContent>
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
            {categories.map((category, index) => (
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
                      {category === DEFAULT_CATEGORY && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-600">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEditing(index)}
                        disabled={category === DEFAULT_CATEGORY}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteCategory(index)}
                        disabled={category === DEFAULT_CATEGORY}
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
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
