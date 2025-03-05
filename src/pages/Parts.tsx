
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Box, Search, Filter, BarChart3 } from 'lucide-react';
import { useState } from 'react';

// Define part type
interface Part {
  id: number;
  sku: string;
  name: string;
  category: string;
  qualityRate: number;
  stock: number;
  status: 'Active' | 'Low Stock' | 'Discontinued';
}

const PartsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock parts data
  const parts: Part[] = [
    { 
      id: 1, 
      sku: 'P-1001', 
      name: 'Aluminum Frame',
      category: 'Structural',
      qualityRate: 99.7,
      stock: 152,
      status: 'Active'
    },
    { 
      id: 2, 
      sku: 'P-1002', 
      name: 'Steel Bearing',
      category: 'Mechanical',
      qualityRate: 99.9,
      stock: 543,
      status: 'Active'
    },
    { 
      id: 3, 
      sku: 'P-1003', 
      name: 'Circuit Board',
      category: 'Electronic',
      qualityRate: 98.5,
      stock: 28,
      status: 'Low Stock'
    },
    { 
      id: 4, 
      sku: 'P-1004', 
      name: 'Plastic Housing',
      category: 'Enclosures',
      qualityRate: 99.2,
      stock: 205,
      status: 'Active'
    },
    { 
      id: 5, 
      sku: 'P-1005', 
      name: 'Power Supply',
      category: 'Electronic',
      qualityRate: 99.0,
      stock: 15,
      status: 'Low Stock'
    },
    { 
      id: 6, 
      sku: 'P-1006', 
      name: 'Control Panel',
      category: 'Interface',
      qualityRate: 99.8,
      stock: 0,
      status: 'Discontinued'
    },
  ];
  
  // Filter parts based on search query
  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    part.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
    <DashboardLayout 
      title="Parts" 
      description="Manage parts inventory and quality metrics"
    >
      <div className="space-y-6">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Box className="mr-2 h-5 w-5" />
              Parts Manager
            </CardTitle>
            <CardDescription>
              Track and manage all parts and their quality metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parts by name, SKU or category..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-8 py-3 px-4 bg-muted/50 text-sm font-medium">
                <div className="col-span-3">Part</div>
                <div className="col-span-1">Category</div>
                <div className="col-span-1 text-right">Quality</div>
                <div className="col-span-1 text-right">Stock</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              
              <div className="divide-y">
                {filteredParts.length > 0 ? (
                  filteredParts.map((part) => (
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
                      <div className="col-span-2 text-right">
                        <Badge variant="outline" className={getStatusBadge(part.status)}>
                          {part.status}
                        </Badge>
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
            
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <div>Showing {filteredParts.length} of {parts.length} parts</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up [animation-delay:100ms]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Metrics</CardTitle>
              <CardDescription>Part quality overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex flex-col items-center justify-center text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Quality metrics visualization will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory Status</CardTitle>
              <CardDescription>Current stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex flex-col items-center justify-center text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Inventory status charts will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PartsPage;
