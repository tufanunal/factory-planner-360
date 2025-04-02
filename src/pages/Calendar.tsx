
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewCalendar from '@/components/calendar/OverviewCalendar';
import WeeklyShiftView from '@/components/calendar/WeeklyShiftView';
import HolidayManager from '@/components/calendar/HolidayManager';
import ShiftTimeManager from '@/components/calendar/ShiftTimeManager';
import { format } from 'date-fns';
import { useData } from '@/contexts/DataContext';

const Calendar = () => {
  const [activeTab, setActiveTab] = useState("shifts");
  const { calendarState, setViewDate } = useData();
  const viewDate = calendarState ? new Date(calendarState.viewDate) : new Date();

  return (
    <DashboardLayout 
      title="Calendar" 
      description="Manage shifts, holidays and view production schedules"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side - Overview Calendar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Calendar Overview</h2>
            <OverviewCalendar 
              viewDate={viewDate}
              onChangeDate={date => setViewDate(format(date, 'yyyy-MM-dd'))}
              holidays={calendarState?.holidays || []}
              dayShiftToggles={calendarState?.dayShiftToggles || []}
            />
          </div>
        </div>

        {/* Right side - Detailed views with tabs */}
        <div className="lg:col-span-8">
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="shifts">Weekly Shift View</TabsTrigger>
                <TabsTrigger value="holidays">Holidays</TabsTrigger>
                <TabsTrigger value="shift-times">Shift Times</TabsTrigger>
              </TabsList>
              
              <TabsContent value="shifts" className="space-y-4 pt-2">
                <WeeklyShiftView 
                  viewDate={viewDate}
                  shiftTimes={calendarState?.shiftTimes || []}
                  dayShiftToggles={calendarState?.dayShiftToggles || []}
                  holidays={calendarState?.holidays || []}
                />
              </TabsContent>
              
              <TabsContent value="holidays" className="space-y-4 pt-2">
                <HolidayManager 
                  holidays={calendarState?.holidays || []}
                />
              </TabsContent>
              
              <TabsContent value="shift-times" className="space-y-4 pt-2">
                <ShiftTimeManager
                  shiftTimes={calendarState?.shiftTimes || []}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
