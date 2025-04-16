
import { format, isWeekend, isSameDay } from 'date-fns';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Holiday, ShiftTime } from '@/types/calendar';

interface ShiftToggleCellProps {
  day: Date;
  shift: ShiftTime;
  isActive: boolean;
  isFirstCell: boolean;
  holidayName: string | null;
  colorStyle: { bg: string; hover: string };
  onToggle: () => void;
  onEdit: () => void;
}

const ShiftToggleCell = ({ 
  day, 
  shift, 
  isActive, 
  isFirstCell,
  holidayName,
  colorStyle,
  onToggle,
  onEdit 
}: ShiftToggleCellProps) => {
  const isWeekendDay = isWeekend(day);

  return (
    <div 
      className={cn(
        "p-3 flex flex-col items-center",
        holidayName && "bg-red-100/50 dark:bg-red-900/20",
        isWeekendDay && !holidayName && "bg-gray-100/50 dark:bg-gray-800/20"
      )}
    >
      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between w-full">
        <div>{shift.startTime} - {shift.endTime}</div>
        {isFirstCell && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 ml-1 -mr-1" 
            onClick={onEdit}
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Toggle 
        pressed={isActive}
        onPressedChange={onToggle}
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
};

export default ShiftToggleCell;
