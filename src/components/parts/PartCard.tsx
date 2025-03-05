
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Package, Pencil } from 'lucide-react';
import { Part } from '@/types/part';

interface PartCardProps {
  part: Part;
  onEdit: (part: Part) => void;
}

const PartCard = ({ part, onEdit }: PartCardProps) => {
  // Function to get status badge styling
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{part.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusBadge(part.status)}>
              {part.status}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(part)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          SKU: {part.sku}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Quality Rate</span>
              <span className="text-sm font-medium">{part.qualityRate}%</span>
            </div>
            <Progress value={part.qualityRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Category</span>
              <span className="font-medium">{part.category}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Stock</span>
              <span className="font-medium">{part.stock} units</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Package className="h-4 w-4 mr-1" />
              <span>Part Details</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartCard;
