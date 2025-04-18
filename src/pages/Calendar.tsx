
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewCalendar from '@/components/calendar/OverviewCalendar';
import WeeklyShiftView from '@/components/calendar/WeeklyShiftView';
import HolidayManager from '@/components/calendar/HolidayManager';
import ShiftTimeManager from '@/components/calendar/ShiftTimeManager';
import { format, isValid, parseISO } from 'date-fns';
import { useData } from '@/contexts/DataContext';
import { toast } from "sonner";

const Calendar = () => {
  const [activeTab, setActiveTab] = useState("shifts");
  const { calendarState, setViewDate } = useData();
  
  // Safe format function to handle potential date issues
  const safeFormat = (date: Date | string | number, formatStr: string): string => {
    try {
      // If it's a string, try to parse it first
      if (typeof date === 'string') {
        const parsedDate = parseISO(date);
        if (!isValid(parsedDate)) throw new Error('Invalid date string');
        return format(parsedDate, formatStr);
      }
      
      // If it's a Date object or timestamp
      if (!isValid(date)) throw new Error('Invalid date');
      return format(date, formatStr);
    } catch (error) {
      console.error('Error formatting date:', error);
      return format(new Date(), formatStr); // Return current date as fallback
    }
  };
  
  // Ensure we have a valid Date object or create a new one
  const viewDate = (() => {
    if (!calendarState || !calendarState.viewDate) return new Date();
    try {
      const parsedDate = parseISO(calendarState.viewDate);
      return isValid(parsedDate) ? parsedDate : new Date();
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date();
    }
  })();

  const handleDateChange = async (date: Date) => {
    try {
      if (isValid(date)) {
        await setViewDate(safeFormat(date, 'yyyy-MM-dd'));
      } else {
        console.error('Invalid date in handleDateChange:', date);
        toast.error("Invalid date selected");
      }
    } catch (error) {
      console.error('Error in handleDateChange:', error);
      toast.error("Failed to update calendar view");
    }
  };

  // Log current state for debugging
  useEffect(() => {
    console.log("Current calendar state:", calendarState);
  }, [calendarState]);

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
              onChangeDate={handleDateChange}
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
