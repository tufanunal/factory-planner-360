
import { 
  Settings, 
  Box, 
  BarChart3, 
  Package, 
  TrendingUp, 
  Calculator,
  Layers,
  Calendar
} from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ModuleCard from '@/components/ui/ModuleCard';
import { useData } from '@/contexts/DataContext';

const Index = () => {
  const { parts, machines, consumables, rawMaterials, calendarState } = useData();
  const [modules, setModules] = useState<any[]>([]);

  // Calculate metrics from actual data
  useEffect(() => {
    const activePartsCount = parts.filter(part => part.status === 'Active').length;
    
    // Calculate average availability from machines with availability property
    // Filter out machines without an availability value first
    const machinesWithAvailability = machines.filter(m => typeof m.availability === 'number');
    const averageAvailability = machinesWithAvailability.length > 0 
      ? Math.round(machinesWithAvailability.reduce((sum, m) => sum + (m.availability || 0), 0) / machinesWithAvailability.length) 
      : 0;
    
    const consumablesCount = consumables.length;
    const rawMaterialsCount = rawMaterials.length;
    const shiftTimeCount = calendarState?.shiftTimes?.length || 0;
    
    console.log("Machines count:", machines.length);
    console.log("Machines with availability count:", machinesWithAvailability.length);
    console.log("Availability values:", machines.map(m => m.availability));
    console.log("Calculated average availability:", averageAvailability);
    
    setModules([
      {
        title: 'Machines',
        description: 'Track production planning and availability',
        icon: <Settings size={24} />,
        path: '/machines',
        metric: { value: `${averageAvailability}%`, label: 'Availability' }
      },
      {
        title: 'Parts',
        description: 'Manage product references and quality metrics',
        icon: <Box size={24} />,
        path: '/parts',
        metric: { value: activePartsCount, label: 'Active Parts' }
      },
      {
        title: 'OEE',
        description: 'Monitor efficiency metrics and future projections',
        icon: <BarChart3 size={24} />,
        path: '/oee',
        metric: { value: '86%', label: 'Current OEE' }
      },
      {
        title: 'Consumables',
        description: 'Track materials usage and forecast needs',
        icon: <Package size={24} />,
        path: '/consumables',
        metric: { value: consumablesCount, label: 'Types Tracked' }
      },
      {
        title: 'Raw Materials',
        description: 'Manage raw materials used in production',
        icon: <Layers size={24} />,
        path: '/raw-materials',
        metric: { value: rawMaterialsCount, label: 'Materials' }
      },
      {
        title: 'Calendar',
        description: 'Manage shifts, holidays, and production schedules',
        icon: <Calendar size={24} />,
        path: '/calendar',
        metric: { value: shiftTimeCount, label: 'Shift Types' }
      },
      {
        title: 'Forecast',
        description: 'Analyze demand patterns and production needs',
        icon: <TrendingUp size={24} />,
        path: '/forecast',
        metric: { value: '8wk', label: 'Forecast Range' }
      },
      {
        title: 'Cost Analysis',
        description: 'Calculate costs based on machines and materials',
        icon: <Calculator size={24} />,
        path: '/cost-breakdown',
        metric: { value: '€125K', label: 'Monthly Cost' }
      }
    ]);
  }, [parts, machines, consumables, rawMaterials, calendarState]);

  return (
    <DashboardLayout 
      title="Factory Planner 360" 
      description="Optimize your production with comprehensive planning tools"
    >
      <div className="relative overflow-hidden pb-16">
        {/* Background effect */}
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)] dark:bg-grid-gray-800 -z-10" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.title}
              title={module.title}
              description={module.description}
              icon={module.icon}
              path={module.path}
              metric={module.metric}
              className={`animate-slide-up [animation-delay:${(index % 3) * 100}ms]`}
            />
          ))}
        </div>
        
        <div className="mt-12 mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-border rounded-full">
            <span className="flex w-3 h-3 me-3 bg-green-400 rounded-full animate-pulse"></span>
            <p className="text-sm font-medium text-foreground">
              All systems operational and running at optimal capacity
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
