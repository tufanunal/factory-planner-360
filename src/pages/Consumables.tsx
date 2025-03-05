
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

// Define consumable type
interface Consumable {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  weeklyUsage: number;
  projectedStock: number;
  status: 'Adequate' | 'Low' | 'Critical';
}

const ConsumablesPage = () => {
  // Mock consumables data
  const consumables: Consumable[] = [
    {
      id: 1,
      name: 'Lubricant Oil',
      category: 'Fluids',
      stock: 240,
      unit: 'liters',
      minStock: 50,
      weeklyUsage: 12,
      projectedStock: 228,
      status: 'Adequate'
    },
    {
      id: 2,
      name: 'Welding Wire',
      category: 'Welding',
      stock: 80,
      unit: 'kg',
      minStock: 25,
      weeklyUsage: 15,
      projectedStock: 65,
      status: 'Adequate'
    },
    {
      id: 3,
      name: 'Cutting Fluid',
      category: 'Fluids',
      stock: 30,
      unit: 'liters',
      minStock: 25,
      weeklyUsage: 8,
      projectedStock: 22,
      status: 'Low'
    },
    {
      id: 4,
      name: 'Adhesive Tape',
      category: 'Packaging',
      stock: 15,
      unit: 'rolls',
      minStock: 20,
      weeklyUsage: 10,
      projectedStock: 5,
      status: 'Critical'
    },
    {
      id: 5,
      name: 'Cardboard Boxes',
      category: 'Packaging',
      stock: 350,
      unit: 'units',
      minStock: 100,
      weeklyUsage: 40,
      projectedStock: 310,
      status: 'Adequate'
    },
    {
      id: 6,
      name: 'Protective Gloves',
      category: 'Safety',
      stock: 45,
      unit: 'pairs',
      minStock: 30,
      weeklyUsage: 12,
      projectedStock: 33,
      status: 'Adequate'
    },
  ];
  
  // Function to determine percentage for progress bars
  const calculatePercentage = (current: number, min: number) => {
    // 100% would be at 4x the minimum stock level
    const maxStock = min * 4;
    return Math.min(Math.max((current / maxStock) * 100, 0), 100);
  };
  
  // Function to get status badge styling
  const getStatusBadge = (status: Consumable['status']) => {
    switch (status) {
      case 'Adequate':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'Low':
        return 'bg-amber-100 text-amber-600 hover:bg-amber-200';
      case 'Critical':
        return 'bg-red-100 text-red-600 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };
  
  // Function to get status icon
  const getStatusIcon = (status: Consumable['status']) => {
    switch (status) {
      case 'Adequate':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Low':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'Critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout 
      title="Consumables" 
      description="Track consumables inventory and usage forecasts"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Items</CardTitle>
              <CardDescription>Tracked consumable types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center pt-4">
                <Package className="h-12 w-12 text-primary/60 mr-4" />
                <div>
                  <div className="text-3xl font-bold">{consumables.length}</div>
                  <div className="text-sm text-muted-foreground">Unique items</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Inventory Status</CardTitle>
              <CardDescription>Current stock health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Adequate</span>
                </div>
                <span className="font-medium">
                  {consumables.filter(c => c.status === 'Adequate').length}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm">Low</span>
                </div>
                <span className="font-medium">
                  {consumables.filter(c => c.status === 'Low').length}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Critical</span>
                </div>
                <span className="font-medium">
                  {consumables.filter(c => c.status === 'Critical').length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Usage Forecast</CardTitle>
              <CardDescription>Projected consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[100px] flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="animate-slide-up [animation-delay:100ms]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Consumables Inventory
            </CardTitle>
            <CardDescription>
              Current stock levels and consumption forecasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {consumables.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="flex items-center mb-2 md:mb-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="text-xs mr-2">
                            {item.category}
                          </Badge>
                          <Badge variant="outline" className={getStatusBadge(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {getStatusIcon(item.status)}
                      <div className="ml-2 text-right">
                        <div className="font-medium">
                          {item.stock} {item.unit}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Min: {item.minStock} {item.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Current Stock</span>
                      <span>{item.stock} / {item.minStock * 4} {item.unit}</span>
                    </div>
                    <Progress 
                      value={calculatePercentage(item.stock, item.minStock)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Weekly Usage:</span>
                      <span className="ml-1 font-medium">{item.weeklyUsage} {item.unit}/week</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Projected (1 week):</span>
                      <span className="ml-1 font-medium">{item.projectedStock} {item.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ConsumablesPage;
