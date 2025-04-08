
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryItemProps {
  category: string;
  index: number;
  defaultCategory: string;
  onEdit: (index: number, newName: string) => void;
  onDelete: (index: number) => void;
}

const CategoryItem = ({ 
  category, 
  index, 
  defaultCategory, 
  onEdit, 
  onDelete 
}: CategoryItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const startEditing = () => {
    if (category === defaultCategory) {
      toast.error('Cannot edit the default category');
      return;
    }
    setIsEditing(true);
    setEditValue(category);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const saveEditing = () => {
    if (!editValue.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    onEdit(index, editValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={saveEditing}>
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
            {category === defaultCategory && (
              <Badge variant="outline" className="bg-blue-100 text-blue-600">Default</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={startEditing}
              disabled={category === defaultCategory}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(index)}
              disabled={category === defaultCategory}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryItem;
