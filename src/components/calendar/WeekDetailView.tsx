
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Calendar, Shift } from '@/types/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

interface WeekDetailViewProps {
  calendar: Calendar;
  shifts: Shift[];
  selectedDate: Date;
  onUpdateShiftSchedule: (date: string, shiftId: number, isActive: boolean) => void;
}

const WeekDetailView: React.FC<WeekDetailViewProps> = ({ 
  calendar, 
  shifts, 
  selectedDate,
  onUpdateShiftSchedule
}) => {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  
  // Generate week days based on selected date
  useEffect(() => {
    const startDay = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
    setWeekDays(days);
  }, [selectedDate]);

  // Check if a date is a holiday
  const isHoliday = (date: Date) => {
    return calendar.holidays.some(holiday => 
      isSameDay(new Date(holiday.date), date)
    );
  };

  // Check if a date is a workday according to the pattern
  const isWorkday = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    return calendar.workdaysPattern[dayOfWeek as keyof typeof calendar.workdaysPattern];
  };

  // Check if a specific shift is active for a date
  const isShiftActive = (date: Date, shiftId: number) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (
      calendar.shiftSchedule && 
      calendar.shiftSchedule[dateStr] && 
      calendar.shiftSchedule[dateStr].shifts[shiftId] !== undefined
    ) {
      return calendar.shiftSchedule[dateStr].shifts[shiftId];
    }
    
    // Default to workday pattern if not explicitly set
    return isWorkday(date) && !isHoliday(date);
  };

  // Handle shift toggle
  const handleShiftToggle = (date: Date, shiftId: number, checked: boolean) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    onUpdateShiftSchedule(dateStr, shiftId, checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week of {format(weekDays[0] || selectedDate, 'MMM d, yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-2 text-center font-medium border-b pb-2 mb-4">
          <div className="col-span-2">Day</div>
          {shifts.map(shift => (
            <div key={shift.id} className="col-span-2">
              {shift.name}
            </div>
          ))}
        </div>

        {weekDays.map(day => {
          const isHolidayDay = isHoliday(day);
          const isWorkingDay = isWorkday(day);

          return (
            <div 
              key={format(day, 'yyyy-MM-dd')} 
              className={`grid grid-cols-8 gap-2 items-center py-3 border-b ${isHolidayDay ? 'bg-red-50' : ''} ${!isWorkingDay && !isHolidayDay ? 'bg-gray-50' : ''}`}
            >
              <div className="col-span-2 text-sm font-medium flex flex-col items-start">
                <span>{format(day, 'EEEE')}</span>
                <span className="text-muted-foreground text-xs">{format(day, 'MMM d')}</span>
                {isHolidayDay && (
                  <span className="text-xs text-red-500 font-medium mt-1">Holiday</span>
                )}
              </div>

              {shifts.map(shift => {
                const active = isShiftActive(day, shift.id);
                const disabled = calendar.isDefault || isHolidayDay;
                
                return (
                  <div key={shift.id} className="col-span-2 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`shift-${shift.id}-${format(day, 'yyyy-MM-dd')}`}
                        checked={active}
                        onCheckedChange={(checked) => handleShiftToggle(day, shift.id, checked)}
                        disabled={disabled}
                      />
                      <Label 
                        htmlFor={`shift-${shift.id}-${format(day, 'yyyy-MM-dd')}`}
                        className="text-xs"
                      >
                        {active ? 'On' : 'Off'}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default WeekDetailView;
