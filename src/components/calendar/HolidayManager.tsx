import { useState } from 'react';
import { format } from 'date-fns';
import { PlusCircle, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useData } from '@/contexts/DataContext';
import { Holiday } from '@/types/calendar';
import { toast } from "sonner";

interface HolidayManagerProps {
  holidays: Holiday[];
}

const HolidayManager = ({ holidays }: HolidayManagerProps) => {
  const { addHoliday, removeHoliday } = useData();
  const [holidayName, setHolidayName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isRecurringYearly, setIsRecurringYearly] = useState(false);

  const handleAddHoliday = async () => {
    if (!holidayName || !selectedDate) return;

    if (addHoliday) {
      try {
        await addHoliday({
          id: Date.now().toString(),
          name: holidayName,
          date: format(selectedDate, 'yyyy-MM-dd'),
          isRecurringYearly
        });
        
        // Reset form
        setHolidayName('');
        setSelectedDate(undefined);
        setIsRecurringYearly(false);
        
        toast.success("Holiday added successfully");
      } catch (error) {
        console.error("Error adding holiday:", error);
        toast.error("Failed to add holiday");
      }
    }
  };

  const handleRemoveHoliday = async (id: string) => {
    if (removeHoliday) {
      try {
        await removeHoliday(id);
        toast.success("Holiday removed successfully");
      } catch (error) {
        console.error("Error removing holiday:", error);
        toast.error("Failed to remove holiday");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add holiday form */}
      <div className="space-y-4 p-4 border rounded-lg bg-card">
        <h3 className="text-lg font-medium">Add Holiday</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="holiday-name">Holiday Name</Label>
            <Input
              id="holiday-name"
              placeholder="Enter holiday name"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recurring-switch">Options</Label>
            <div className="flex items-center space-x-2 h-10">
              <Switch
                id="recurring-switch"
                checked={isRecurringYearly}
                onCheckedChange={setIsRecurringYearly}
              />
              <Label htmlFor="recurring-switch">Recurring Yearly</Label>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleAddHoliday} 
          disabled={!holidayName || !selectedDate}
          className="w-full mt-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Holiday
        </Button>
      </div>
      
      {/* Holidays list */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Holiday Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No holidays added yet
                </TableCell>
              </TableRow>
            ) : (
              holidays.map(holiday => {
                const holidayDate = new Date(holiday.date);
                return (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell>
                      {holiday.isRecurringYearly ? 
                        format(holidayDate, 'MMMM d') + ' (Every year)' : 
                        format(holidayDate, 'PPP')}
                    </TableCell>
                    <TableCell>
                      {holiday.isRecurringYearly ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHoliday(holiday.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HolidayManager;
