
import { useState } from 'react';
import { Part } from '@/types/part';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

interface PartTableProps {
  parts: Part[];
  onEdit: (part: Part) => void;
  onDelete: (partId: string) => void;
}

const PartTable = ({ parts, onEdit, onDelete }: PartTableProps) => {
  // Status badge styling
  const getStatusBadge = (status: Part['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-600 hover:bg-amber-200';
      case 'Discontinued':
        return 'bg-red-100 text-red-600 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-8 py-3 px-4 bg-muted/50 text-sm font-medium">
        <div className="col-span-3">Part</div>
        <div className="col-span-1">Category</div>
        <div className="col-span-1 text-right">Quality</div>
        <div className="col-span-1 text-right">Stock</div>
        <div className="col-span-1 text-right">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      
      <div className="divide-y">
        {parts.length > 0 ? (
          parts.map((part) => (
            <div key={part.id} className="grid grid-cols-8 py-3 px-4 items-center">
              <div className="col-span-3">
                <div className="font-medium">{part.name}</div>
                <div className="text-sm text-muted-foreground">{part.sku}</div>
              </div>
              <div className="col-span-1">
                <Badge variant="outline">{part.category}</Badge>
              </div>
              <div className="col-span-1 text-right">
                <span className={`font-medium ${part.qualityRate >= 99.5 ? 'text-green-600' : 'text-amber-600'}`}>
                  {part.qualityRate}%
                </span>
              </div>
              <div className="col-span-1 text-right font-medium">
                {part.stock}
              </div>
              <div className="col-span-1 text-right">
                <Badge variant="outline" className={getStatusBadge(part.status)}>
                  {part.status}
                </Badge>
              </div>
              <div className="col-span-1 text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(part)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(part.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No parts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default PartTable;
