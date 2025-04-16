
import { format, isWeekend, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Holiday } from '@/types/calendar';

interface DayHeaderProps {
  day: Date;
  isToday: boolean;
  holidays: Holiday[];
}

const DayHeader = ({ day, isToday, holidays }: DayHeaderProps) => {
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

  const holidayName = getHolidayName(day);
  const isWeekendDay = isWeekend(day);

  return (
    <div 
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
  );
};

export default DayHeader;
