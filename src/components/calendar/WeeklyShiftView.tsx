
import { useState, useEffect, useMemo } from 'react';
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isSameWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { Holiday, ShiftTime } from '@/types/calendar';
import { toast } from "sonner";
import DayHeader from './DayHeader';
import ShiftToggleCell from './ShiftToggleCell';
import ShiftEditDialog from './ShiftEditDialog';
import { colorMap, defaultColor } from './shiftColors';

interface WeeklyShiftViewProps {
  viewDate: Date;
  shiftTimes: ShiftTime[];
  dayShiftToggles: any[];
  holidays: Holiday[];
}

const WeeklyShiftView = ({
  viewDate,
  shiftTimes,
  dayShiftToggles,
  holidays
}: WeeklyShiftViewProps) => {
  const { toggleShift, updateShiftTime, setViewDate } = useData();
  const [currentDate, setCurrentDate] = useState(viewDate);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [editingShift, setEditingShift] = useState<ShiftTime | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [shiftColor, setShiftColor] = useState("blue");

  useEffect(() => {
    if (!isSameWeek(viewDate, weekStart, { weekStartsOn: 1 })) {
      setWeekStart(startOfWeek(viewDate, { weekStartsOn: 1 }));
    }
    setCurrentDate(viewDate);
  }, [viewDate, weekStart]);

  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const getShiftState = (date: Date, shiftTimeId: string): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dayShiftToggles.some(shift => 
      shift.date === dateStr && 
      shift.shiftTimeId === shiftTimeId &&
      shift.isActive
    );
  };

  const handleShiftToggle = async (date: Date, shiftTimeId: string) => {
    if (toggleShift) {
      try {
        await toggleShift(format(date, 'yyyy-MM-dd'), shiftTimeId);
      } catch (error) {
        console.error("Error toggling shift:", error);
        toast.error("Failed to update shift");
      }
    }
  };

  const navigateToPrevWeek = () => {
    const newStart = subWeeks(weekStart, 1);
    setWeekStart(newStart);
    const newDate = format(newStart, 'yyyy-MM-dd');
    setViewDate(newDate);
  };

  const navigateToNextWeek = () => {
    const newStart = addWeeks(weekStart, 1);
    setWeekStart(newStart);
    const newDate = format(newStart, 'yyyy-MM-dd');
    setViewDate(newDate);
  };

  const handleEditShift = (shift: ShiftTime) => {
    setEditingShift(shift);
    setShiftName(shift.name);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setShiftColor(shift.color || 'blue');
    setIsEditDialogOpen(true);
  };

  const handleSaveShift = async () => {
    if (!editingShift) return;
    
    try {
      const updatedShift: ShiftTime = {
        ...editingShift,
        name: shiftName,
        startTime: startTime,
        endTime: endTime,
        color: shiftColor
      };
      
      await updateShiftTime(updatedShift);
      setIsEditDialogOpen(false);
      toast.success("Shift updated successfully");
    } catch (error) {
      console.error("Error updating shift:", error);
      toast.error("Failed to update shift");
    }
  };

  const getShiftColors = (shift: ShiftTime) => {
    if (shift.color && colorMap[shift.color]) {
      return colorMap[shift.color];
    }
    return defaultColor;
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
            Week {format(weekStart, 'w')}, {format(weekStart, 'yyyy')}
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
          {daysOfWeek.map((day) => (
            <DayHeader
              key={`header-${day.toString()}`}
              day={day}
              isToday={isSameDay(day, new Date())}
              holidays={holidays}
            />
          ))}
        </div>
        
        <div className="divide-y divide-border">
          {shiftTimes.map((shift) => {
            const colorStyle = getShiftColors(shift);
            
            return (
              <div 
                key={shift.id}
                className="grid grid-cols-7 divide-x divide-border"
              >
                {daysOfWeek.map((day, index) => {
                  const isActive = getShiftState(day, shift.id);
                  const holidayName = holidays.find(h => isSameDay(new Date(h.date), day))?.name || null;
                  
                  return (
                    <ShiftToggleCell
                      key={`${day.toString()}-${shift.id}`}
                      day={day}
                      shift={shift}
                      isActive={isActive}
                      isFirstCell={index === 0}
                      holidayName={holidayName}
                      colorStyle={colorStyle}
                      onToggle={() => handleShiftToggle(day, shift.id)}
                      onEdit={() => handleEditShift(shift)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <ShiftEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        editingShift={editingShift}
        shiftName={shiftName}
        startTime={startTime}
        endTime={endTime}
        shiftColor={shiftColor}
        onShiftNameChange={setShiftName}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onShiftColorChange={setShiftColor}
        onSave={handleSaveShift}
      />
    </div>
  );
};

export default WeeklyShiftView;
