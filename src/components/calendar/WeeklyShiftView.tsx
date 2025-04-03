
import { useState, useEffect, useMemo } from 'react';
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
import { ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { useData } from '@/contexts/DataContext';
import { Holiday, ShiftTime, DayShiftToggle } from '@/types/calendar';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define color mapping
const colorMap: Record<string, { bg: string, hover: string }> = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", hover: "hover:bg-blue-200 dark:hover:bg-blue-900/50" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", hover: "hover:bg-green-200 dark:hover:bg-green-900/50" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/30", hover: "hover:bg-yellow-200 dark:hover:bg-yellow-900/50" },
  red: { bg: "bg-red-100 dark:bg-red-900/30", hover: "hover:bg-red-200 dark:hover:bg-red-900/50" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", hover: "hover:bg-purple-200 dark:hover:bg-purple-900/50" },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30", hover: "hover:bg-pink-200 dark:hover:bg-pink-900/50" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", hover: "hover:bg-indigo-200 dark:hover:bg-indigo-900/50" },
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", hover: "hover:bg-cyan-200 dark:hover:bg-cyan-900/50" },
  teal: { bg: "bg-teal-100 dark:bg-teal-900/30", hover: "hover:bg-teal-200 dark:hover:bg-teal-900/50" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900/30", hover: "hover:bg-orange-200 dark:hover:bg-orange-900/50" },
  amber: { bg: "bg-amber-100 dark:bg-amber-900/30", hover: "hover:bg-amber-200 dark:hover:bg-amber-900/50" },
  lime: { bg: "bg-lime-100 dark:bg-lime-900/30", hover: "hover:bg-lime-200 dark:hover:bg-lime-900/50" },
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", hover: "hover:bg-emerald-200 dark:hover:bg-emerald-900/50" },
  sky: { bg: "bg-sky-100 dark:bg-sky-900/30", hover: "hover:bg-sky-200 dark:hover:bg-sky-900/50" },
  violet: { bg: "bg-violet-100 dark:bg-violet-900/30", hover: "hover:bg-violet-200 dark:hover:bg-violet-900/50" },
  fuchsia: { bg: "bg-fuchsia-100 dark:bg-fuchsia-900/30", hover: "hover:bg-fuchsia-200 dark:hover:bg-fuchsia-900/50" }
};

const colorOptions = Object.keys(colorMap);

// Default fallback color
const defaultColor = { bg: "bg-gray-100 dark:bg-gray-900/30", hover: "hover:bg-gray-200 dark:hover:bg-gray-900/50" };

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
  const { toggleShift, updateShiftTime } = useData();
  const [currentDate, setCurrentDate] = useState(viewDate);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [editingShift, setEditingShift] = useState<ShiftTime | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [shiftColor, setShiftColor] = useState("blue");

  // Change week when date changes
  useEffect(() => {
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
    setCurrentDate(newStart);
  };

  const navigateToNextWeek = () => {
    const newStart = addWeeks(weekStart, 1);
    setWeekStart(newStart);
    setCurrentDate(newStart);
  };

  const handleEditShift = (shift: ShiftTime) => {
    setEditingShift(shift);
    setShiftName(shift.name);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setShiftColor(shift.color);
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
          {shiftTimes.map((shift) => {
            const colorStyle = colorMap[shift.color] || defaultColor;
            
            return (
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
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between w-full">
                        <div>{shift.startTime} - {shift.endTime}</div>
                        {day === daysOfWeek[0] && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 ml-1 -mr-1" 
                            onClick={() => handleEditShift(shift)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <Toggle 
                        pressed={isActive}
                        onPressedChange={() => handleShiftToggle(day, shift.id)}
                        size="sm"
                        variant="outline"
                        className={cn(
                          "w-full justify-center",
                          isActive && colorStyle.bg,
                          isActive && colorStyle.hover
                        )}
                        disabled={!!holidayName}
                      >
                        {shift.name}
                      </Toggle>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Shift Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shiftName" className="text-right">
                Name
              </Label>
              <Input
                id="shiftName"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Select value={shiftColor} onValueChange={setShiftColor}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center">
                        <div 
                          className={`w-4 h-4 mr-2 rounded ${colorMap[color].bg}`} 
                        />
                        <span className="capitalize">{color}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4 mt-2">
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <Button 
                    key={color}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-8 h-8 p-0 rounded-md",
                      colorMap[color].bg,
                      shiftColor === color && "ring-2 ring-primary"
                    )}
                    onClick={() => setShiftColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveShift}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyShiftView;
