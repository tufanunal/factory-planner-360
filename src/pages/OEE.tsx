
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Clock, 
  Activity, 
  Scale, 
  TrendingUp 
} from 'lucide-react';

const OEEPage = () => {
  // Mock OEE data
  const currentOEE = {
    overall: 82,
    availability: 94,
    performance: 86,
    quality: 97,
  };
  
  // Mock trend data (would be used for charts)
  const trends = {
    lastWeek: 80,
    lastMonth: 79,
    lastQuarter: 76,
  };

  return (
    <DashboardLayout 
      title="OEE" 
      description="Overall Equipment Effectiveness metrics and projections"
    >
      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-3 mb-6 animate-fade-in">
          <TabsTrigger value="current">Current Metrics</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="projection">Projection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall OEE */}
            <Card className="md:col-span-4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Overall OEE
                </CardTitle>
                <CardDescription>
                  Current OEE score across all equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative">
                    <svg className="w-40 h-40">
                      <circle
                        className="text-gray-100"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="70"
                        cx="80"
                        cy="80"
                      />
                      <circle
                        className="text-primary transition-all duration-1000 ease-in-out"
                        strokeWidth="10"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * currentOEE.overall) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="70"
                        cx="80"
                        cy="80"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{currentOEE.overall}%</span>
                      <span className="text-sm text-muted-foreground">Overall OEE</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-8 mt-8 w-full max-w-2xl">
                    <div className="text-center">
                      <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center justify-center">
                        <Clock className="mr-1 h-3 w-3" />
                        AVAILABILITY
                      </div>
                      <div className="text-2xl font-bold">{currentOEE.availability}%</div>
                      <Progress value={currentOEE.availability} className="h-1.5 mt-2" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center justify-center">
                        <Activity className="mr-1 h-3 w-3" />
                        PERFORMANCE
                      </div>
                      <div className="text-2xl font-bold">{currentOEE.performance}%</div>
                      <Progress value={currentOEE.performance} className="h-1.5 mt-2" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center justify-center">
                        <Scale className="mr-1 h-3 w-3" />
                        QUALITY
                      </div>
                      <div className="text-2xl font-bold">{currentOEE.quality}%</div>
                      <Progress value={currentOEE.quality} className="h-1.5 mt-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Trend cards */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Last Week</CardTitle>
                  <TrendingUp className={`h-4 w-4 ${
                    trends.lastWeek < currentOEE.overall ? 'text-red-500' : 'text-green-500'
                  }`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trends.lastWeek}%</div>
                <div className="text-xs text-muted-foreground">
                  {trends.lastWeek < currentOEE.overall 
                    ? `+${currentOEE.overall - trends.lastWeek}% increase` 
                    : `-${trends.lastWeek - currentOEE.overall}% decrease`
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Last Month</CardTitle>
                  <TrendingUp className={`h-4 w-4 ${
                    trends.lastMonth < currentOEE.overall ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trends.lastMonth}%</div>
                <div className="text-xs text-muted-foreground">
                  {trends.lastMonth < currentOEE.overall 
                    ? `+${currentOEE.overall - trends.lastMonth}% increase` 
                    : `-${trends.lastMonth - currentOEE.overall}% decrease`
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Last Quarter</CardTitle>
                  <TrendingUp className={`h-4 w-4 ${
                    trends.lastQuarter < currentOEE.overall ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trends.lastQuarter}%</div>
                <div className="text-xs text-muted-foreground">
                  {trends.lastQuarter < currentOEE.overall 
                    ? `+${currentOEE.overall - trends.lastQuarter}% increase` 
                    : `-${trends.lastQuarter - currentOEE.overall}% decrease`
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Target</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-xs text-muted-foreground">
                  {currentOEE.overall < 85 
                    ? `${85 - currentOEE.overall}% to target` 
                    : `${currentOEE.overall - 85}% above target`
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="historical" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>Historical OEE</CardTitle>
              <CardDescription>
                View OEE metrics over various time periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-center">
                <div>
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Historical OEE charts will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projection" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>OEE Projection</CardTitle>
              <CardDescription>
                Future OEE projections based on current trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-center">
                <div>
                  <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    OEE forecast visualization will be displayed here
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

export default OEEPage;
