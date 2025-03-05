
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  CalendarDays, 
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Define forecast type
interface Forecast {
  id: number;
  partId: string;
  partName: string;
  category: string;
  currentDemand: number;
  weeklyDemand: number[];
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

const ForecastPage = () => {
  // Mock forecast data
  const forecasts: Forecast[] = [
    {
      id: 1,
      partId: 'P-1001',
      partName: 'Aluminum Frame',
      category: 'Structural',
      currentDemand: 120,
      weeklyDemand: [110, 115, 120, 125, 130, 135, 140, 145],
      trend: 'up',
      changePercentage: 4.2
    },
    {
      id: 2,
      partId: 'P-1002',
      partName: 'Steel Bearing',
      category: 'Mechanical',
      currentDemand: 540,
      weeklyDemand: [560, 555, 550, 545, 540, 535, 530, 525],
      trend: 'down',
      changePercentage: 2.7
    },
    {
      id: 3,
      partId: 'P-1003',
      partName: 'Circuit Board',
      category: 'Electronic',
      currentDemand: 85,
      weeklyDemand: [85, 85, 85, 85, 85, 85, 85, 85],
      trend: 'stable',
      changePercentage: 0
    },
    {
      id: 4,
      partId: 'P-1004',
      partName: 'Plastic Housing',
      category: 'Enclosures',
      currentDemand: 210,
      weeklyDemand: [200, 203, 206, 210, 215, 218, 220, 225],
      trend: 'up',
      changePercentage: 2.3
    },
    {
      id: 5,
      partId: 'P-1005',
      partName: 'Power Supply',
      category: 'Electronic',
      currentDemand: 65,
      weeklyDemand: [70, 68, 67, 65, 63, 61, 60, 58],
      trend: 'down',
      changePercentage: 3.0
    },
  ];
  
  // Function to get trend icon and styling
  const getTrendInfo = (trend: Forecast['trend'], percentage: number) => {
    switch (trend) {
      case 'up':
        return {
          icon: <ArrowUpRight className="h-4 w-4" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: `+${percentage}%`
        };
      case 'down':
        return {
          icon: <ArrowDownRight className="h-4 w-4" />,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: `-${percentage}%`
        };
      case 'stable':
        return {
          icon: <ArrowUpRight className="h-4 w-4 rotate-90" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: 'Stable'
        };
    }
  };

  return (
    <DashboardLayout 
      title="Forecast" 
      description="Weekly demand forecast per part"
    >
      <Tabs defaultValue="weekly">
        <TabsList className="grid w-full grid-cols-3 mb-6 animate-fade-in">
          <TabsTrigger value="weekly">Weekly Forecast</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Projection</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly Outlook</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Weekly Demand Forecast
                    </CardTitle>
                    <CardDescription>
                      8-week projection for all parts
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <FileText className="mr-1 h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      8 weeks
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {forecasts.map((forecast) => {
                    const trendInfo = getTrendInfo(forecast.trend, forecast.changePercentage);
                    return (
                      <div key={forecast.id} className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="font-medium">{forecast.partName}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-muted-foreground mr-2">
                                {forecast.partId}
                              </span>
                              <Badge variant="outline">
                                {forecast.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-2 md:mt-0">
                            <Badge variant="outline" className={`${trendInfo.bgColor} ${trendInfo.color} flex items-center`}>
                              {trendInfo.icon}
                              <span className="ml-1">{trendInfo.label}</span>
                            </Badge>
                            <div className="ml-4 text-right">
                              <div className="font-medium">
                                {forecast.currentDemand} units
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Current weekly demand
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-8 gap-2 mt-4">
                          {forecast.weeklyDemand.map((demand, index) => (
                            <div key={index} className="text-center">
                              <div className={`
                                h-20 relative flex items-end justify-center rounded-md
                                ${demand > forecast.currentDemand ? 'bg-green-100' : demand < forecast.currentDemand ? 'bg-red-100' : 'bg-gray-100'}
                              `}>
                                <div 
                                  className={`
                                    w-full rounded-md
                                    ${demand > forecast.currentDemand ? 'bg-green-200' : demand < forecast.currentDemand ? 'bg-red-200' : 'bg-gray-200'}
                                  `}
                                  style={{ 
                                    height: `${(demand / Math.max(...forecast.weeklyDemand)) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="mt-1 text-xs font-medium">W{index + 1}</div>
                              <div className="text-xs">{demand}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Demand Trends</CardTitle>
                <CardDescription>
                  Overall forecast analysis across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Demand trend analysis visualization will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Monthly Projection
              </CardTitle>
              <CardDescription>
                Three-month demand forecast aggregation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-center">
                <div>
                  <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Monthly forecast data will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quarterly" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Quarterly Outlook
              </CardTitle>
              <CardDescription>
                Long-term quarterly demand projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-center">
                <div>
                  <TrendingDown className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Quarterly forecast visualization will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ForecastPage;
