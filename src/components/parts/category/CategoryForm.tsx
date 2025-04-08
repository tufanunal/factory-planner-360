
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryFormProps {
  categories: string[];
  onAddCategory: (category: string) => void;
}

const CategoryForm = ({ categories, onAddCategory }: CategoryFormProps) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    if (categories.includes(newCategory)) {
      toast.error('Category already exists');
      return;
    }
    
    onAddCategory(newCategory);
    setNewCategory('');
    toast.success('Category added successfully');
  };

  return (
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
  );
};

export default CategoryForm;
