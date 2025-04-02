
import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  getISOWeek,
  startOfWeek,
  getYear,
  setYear,
  setMonth,
  addYears,
  subYears,
  isSameMonth,
  isSameDay,
  isWeekend
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Holiday, DayShiftToggle } from '@/types/calendar';

interface OverviewCalendarProps {
  viewDate: Date;
  onChangeDate: (date: Date) => void;
  holidays: Holiday[];
  dayShiftToggles: DayShiftToggle[];
}

type CalendarMode = 'day' | 'month' | 'year';

const OverviewCalendar = ({ 
  viewDate, 
  onChangeDate,
  holidays,
  dayShiftToggles
}: OverviewCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(viewDate);
  const [mode, setMode] = useState<CalendarMode>('day');
  
  useEffect(() => {
    setCurrentDate(viewDate);
  }, [viewDate]);

  // Helper to check if a date is a holiday
  const isHoliday = (date: Date) => {
    return holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return isSameDay(date, holidayDate) || 
        (holiday.isRecurringYearly && 
          holidayDate.getMonth() === date.getMonth() && 
          holidayDate.getDate() === date.getDate());
    });
  };

  // Helper to check if a date has any active shifts
  const hasActiveShift = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return dayShiftToggles.some(shift => 
      shift.date === dateString && shift.isActive
    );
  };

  // Render days view (default calendar view)
  const renderDaysView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday as first day
    
    // Generate all days for the calendar grid
    const days = eachDayOfInterval({
      start: startDate,
      end: endOfMonth(addMonths(startDate, 1))
    }).slice(0, 42); // Always show 6 weeks (42 days)

    return (
      <div className="text-sm">
        {/* Weekday headers */}
        <div className="grid grid-cols-8 gap-1 mb-2 text-xs text-center font-medium text-muted-foreground">
          <div>Week</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Calendar grid with days */}
        <div className="grid grid-cols-8 gap-1">
          {days.map((day, i) => {
            // Show week number at the beginning of each week
            const showWeekNum = i % 7 === 0;
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isHolidayDay = isHoliday(day);
            const hasShift = hasActiveShift(day);
            const isWeekendDay = isWeekend(day);
            
            return (
              <>
                {showWeekNum && (
                  <div 
                    key={`week-${i}`}
                    className="flex items-center justify-center h-8 text-xs text-muted-foreground bg-muted/30 rounded"
                  >
                    {getISOWeek(day)}
                  </div>
                )}
                <button
                  key={format(day, 'yyyy-MM-dd')}
                  onClick={() => {
                    onChangeDate(day);
                    setCurrentDate(day);
                  }}
                  className={cn(
                    "h-8 rounded flex items-center justify-center text-xs transition-colors",
                    !isCurrentMonth && "text-muted-foreground opacity-50",
                    isToday && "border border-primary",
                    isHolidayDay && "bg-red-100 dark:bg-red-900/30",
                    hasShift && !isHolidayDay && "bg-green-100 dark:bg-green-900/30",
                    isWeekendDay && !isHolidayDay && "bg-gray-100 dark:bg-gray-800/30",
                    !isHolidayDay && !hasShift && !isWeekendDay && "hover:bg-muted"
                  )}
                  disabled={!isCurrentMonth}
                >
                  {format(day, 'd')}
                </button>
              </>
            );
          })}
        </div>
      </div>
    );
  };

  // Render months view
  const renderMonthsView = () => {
    const year = getYear(currentDate);
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(year, i, 1);
      return date;
    });

    return (
      <div className="grid grid-cols-3 gap-2 text-sm">
        {months.map(month => (
          <button
            key={month.toString()}
            onClick={() => {
              setCurrentDate(month);
              setMode('day');
            }}
            className={cn(
              "p-2 rounded hover:bg-muted flex items-center justify-center",
              isSameMonth(month, new Date()) && "border border-primary"
            )}
          >
            {format(month, 'MMM')}
          </button>
        ))}
      </div>
    );
  };

  // Render years view
  const renderYearsView = () => {
    const currentYear = getYear(currentDate);
    const startYear = currentYear - 6;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="grid grid-cols-3 gap-2 text-sm">
        {years.map(year => (
          <button
            key={year}
            onClick={() => {
              setCurrentDate(setYear(currentDate, year));
              setMode('month');
            }}
            className={cn(
              "p-2 rounded hover:bg-muted flex items-center justify-center",
              year === getYear(new Date()) && "border border-primary"
            )}
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  // Navigation buttons based on current mode
  const handlePrevious = () => {
    switch (mode) {
      case 'day':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subYears(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(subYears(currentDate, 12));
        break;
    }
  };

  const handleNext = () => {
    switch (mode) {
      case 'day':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addYears(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(addYears(currentDate, 12));
        break;
    }
  };

  return (
    <div>
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-1">
          {mode !== 'month' && (
            <Button 
              variant="ghost" 
              onClick={() => setMode('month')}
              className={cn(
                mode === 'day' && "font-medium"
              )}
            >
              {format(currentDate, 'MMMM')}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => setMode(mode === 'year' ? 'month' : 'year')}
            className={cn(
              mode === 'year' && "font-medium"
            )}
          >
            {format(currentDate, 'yyyy')}
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar content based on mode */}
      <div className="p-1">
        {mode === 'day' && renderDaysView()}
        {mode === 'month' && renderMonthsView()}
        {mode === 'year' && renderYearsView()}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded mr-1"></div>
          <span>Working Day</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded mr-1"></div>
          <span>Holiday</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800/30 rounded mr-1"></div>
          <span>Weekend</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewCalendar;
