
import { useState, useMemo } from 'react';
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  getISOWeek,
  getYear,
  addWeeks,
  subWeeks,
  isSameWeek,
  isWeekend
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { useData } from '@/contexts/DataContext';
import { Holiday, ShiftTime, DayShiftToggle } from '@/types/calendar';

interface WeeklyShiftViewProps {
  viewDate: Date;
  shiftTimes: ShiftTime[];
  dayShiftToggles: DayShiftToggle[];
  holidays: Holiday[];
}

const WeeklyShiftView = ({
  viewDate,
  shiftTimes,
  dayShiftToggles,
  holidays
}: WeeklyShiftViewProps) => {
  const { toggleShift } = useData();
  const [currentDate, setCurrentDate] = useState(viewDate);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(currentDate, { weekStartsOn: 1 }));

  // Change week when date changes
  useMemo(() => {
    // Only update if the new date is outside current week
    if (!isSameWeek(viewDate, weekStart, { weekStartsOn: 1 })) {
      setWeekStart(startOfWeek(viewDate, { weekStartsOn: 1 }));
    }
    setCurrentDate(viewDate);
  }, [viewDate, weekStart]);

  // Generate the 7 days of the week
  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const isHoliday = (date: Date) => {
    return holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return isSameDay(date, holidayDate) || 
        (holiday.isRecurringYearly && 
          holidayDate.getMonth() === date.getMonth() && 
          holidayDate.getDate() === date.getDate());
    });
  };

  const getHolidayName = (date: Date): string | null => {
    const holiday = holidays.find(h => {
      const holidayDate = new Date(h.date);
      return isSameDay(date, holidayDate) || 
        (h.isRecurringYearly && 
          holidayDate.getMonth() === date.getMonth() && 
          holidayDate.getDate() === date.getDate());
    });
    return holiday ? holiday.name : null;
  };

  const getShiftState = (date: Date, shiftTimeId: string): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dayShiftToggles.some(shift => 
      shift.date === dateStr && 
      shift.shiftTimeId === shiftTimeId &&
      shift.isActive
    );
  };

  const handleShiftToggle = (date: Date, shiftTimeId: string) => {
    if (toggleShift) {
      toggleShift(format(date, 'yyyy-MM-dd'), shiftTimeId);
    }
  };

  const navigateToPrevWeek = () => {
    const newStart = subWeeks(weekStart, 1);
    setWeekStart(newStart);
    setCurrentDate(newStart);
  };

  const navigateToNextWeek = () => {
    const newStart = addWeeks(weekStart, 1);
    setWeekStart(newStart);
    setCurrentDate(newStart);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={navigateToPrevWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            Week {getISOWeek(weekStart)}, {getYear(weekStart)}
          </span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={navigateToNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 divide-x divide-border">
          {/* Day headers */}
          {daysOfWeek.map((day) => {
            const isToday = isSameDay(day, new Date());
            const holidayName = getHolidayName(day);
            const isWeekendDay = isWeekend(day);
            
            return (
              <div 
                key={`header-${day.toString()}`}
                className={cn(
                  "p-2 text-center",
                  isToday && "bg-primary/10",
                  holidayName && "bg-red-100 dark:bg-red-900/30",
                  isWeekendDay && !holidayName && "bg-gray-100 dark:bg-gray-800/30"
                )}
              >
                <div className="font-medium">{format(day, 'EEE')}</div>
                <div className="text-sm">{format(day, 'd MMM')}</div>
                {holidayName && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                    {holidayName}
                  </div>
                )}
              </div>
            )}
          )}
        </div>
        
        {/* Shift toggles for each day */}
        <div className="divide-y divide-border">
          {shiftTimes.map((shift) => (
            <div 
              key={shift.id}
              className="grid grid-cols-7 divide-x divide-border"
            >
              {daysOfWeek.map((day) => {
                const isActive = getShiftState(day, shift.id);
                const holidayName = getHolidayName(day);
                const isWeekendDay = isWeekend(day);
                
                return (
                  <div 
                    key={`${day.toString()}-${shift.id}`}
                    className={cn(
                      "p-3 flex flex-col items-center",
                      holidayName && "bg-red-100/50 dark:bg-red-900/20",
                      isWeekendDay && !holidayName && "bg-gray-100/50 dark:bg-gray-800/20"
                    )}
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {shift.startTime} - {shift.endTime}
                    </div>
                    <Toggle 
                      pressed={isActive}
                      onPressedChange={() => handleShiftToggle(day, shift.id)}
                      size="sm"
                      variant="outline"
                      className={cn(
                        "w-full justify-center",
                        isActive && `bg-${shift.color}-100 dark:bg-${shift.color}-900/30 hover:bg-${shift.color}-200 dark:hover:bg-${shift.color}-900/50`
                      )}
                      disabled={!!holidayName}
                    >
                      {shift.name}
                    </Toggle>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyShiftView;
