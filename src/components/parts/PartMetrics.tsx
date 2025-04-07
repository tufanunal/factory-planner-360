
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const PartMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up [animation-delay:200ms]">
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
  );
};

export default PartMetrics;
