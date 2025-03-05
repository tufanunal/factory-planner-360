
import { Calculator } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const CostBreakdown = () => {
  return (
    <DashboardLayout 
      title="Cost Analysis" 
      description="Calculate manufacturing costs based on machines, labor, and materials"
    >
      <div className="relative overflow-hidden pb-16">
        <div className="grid gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Cost Breakdown</h2>
            </div>
            
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
              <p className="text-muted-foreground">Cost analysis content will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CostBreakdown;
