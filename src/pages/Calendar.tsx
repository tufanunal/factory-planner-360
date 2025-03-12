
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle,
  CalendarDays, 
  Clock, 
  Edit, 
  Globe, 
  Info, 
  Plus, 
  Trash2, 
  Users
} from 'lucide-react';
import { format, isSameDay, isWeekend, addDays, parseISO } from 'date-fns';
import ShiftEditModal from '@/components/calendar/ShiftEditModal';
import HolidayEditModal from '@/components/calendar/HolidayEditModal';
import CalendarEditModal from '@/components/calendar/CalendarEditModal';
import WeekDetailView from '@/components/calendar/WeekDetailView';
import { Holiday, Shift, Calendar as CalendarType, ShiftSchedule } from '@/types/calendar';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CalendarPage = () => {
  const { 
    shifts, setShifts, 
    calendars, setCalendars,
    activeCalendarId, setActiveCalendarId 
  } = useData();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarType | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'shift' | 'holiday' | 'calendar', id: number | string } | null>(null);

  // Get current active calendar
  const activeCalendar = calendars.find(cal => cal.id === activeCalendarId) || calendars[0];
  
  // Handle shift operations
  const handleAddShift = () => {
    setSelectedShift(null);
    setIsShiftModalOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setIsShiftModalOpen(true);
  };

  const handleSaveShift = (shift: Shift) => {
    if (selectedShift) {
      setShifts(shifts.map(s => s.id === shift.id ? shift : s));
    } else {
      setShifts([...shifts, shift]);
    }
    setIsShiftModalOpen(false);
  };

  const handleDeleteShift = (shiftId: number) => {
    setItemToDelete({ type: 'shift', id: shiftId });
    setDeleteConfirmOpen(true);
  };

  // Handle holiday operations
  const handleAddHoliday = () => {
    setSelectedHoliday(null);
    setIsHolidayModalOpen(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsHolidayModalOpen(true);
  };

  const handleSaveHoliday = (holiday: Holiday) => {
    const updatedCalendars = calendars.map(cal => {
      if (cal.id === activeCalendarId) {
        const updatedHolidays = selectedHoliday
          ? cal.holidays.map(h => h.id === holiday.id ? holiday : h)
          : [...cal.holidays, holiday];
        
        return {
          ...cal,
          holidays: updatedHolidays
        };
      }
      return cal;
    });
    
    setCalendars(updatedCalendars);
    setIsHolidayModalOpen(false);
  };

  const handleDeleteHoliday = (holidayId: number) => {
    setItemToDelete({ type: 'holiday', id: holidayId });
    setDeleteConfirmOpen(true);
  };

  // Handle calendar operations
  const handleAddCalendar = () => {
    setSelectedCalendar(null);
    setIsCalendarModalOpen(true);
  };

  const handleEditCalendar = (calendar: CalendarType) => {
    setSelectedCalendar(calendar);
    setIsCalendarModalOpen(true);
  };

  const handleSaveCalendar = (calendar: CalendarType) => {
    if (selectedCalendar) {
      // Update existing calendar
      setCalendars(calendars.map(cal => cal.id === calendar.id ? calendar : cal));
    } else {
      // Add new calendar
      setCalendars([...calendars, calendar]);
      
      // If this is the first non-default calendar, set it as active
      if (calendars.length === 1 && calendars[0].isDefault) {
        setActiveCalendarId(calendar.id);
      }
    }
    setIsCalendarModalOpen(false);
  };

  const handleDeleteCalendar = (calendarId: string) => {
    // Prevent deletion of default calendar
    const calToDelete = calendars.find(cal => cal.id === calendarId);
    if (calToDelete?.isDefault) {
      toast.error("Cannot delete the default calendar");
      return;
    }
    
    setItemToDelete({ type: 'calendar', id: calendarId });
    setDeleteConfirmOpen(true);
  };

  // Handle shift schedule updates
  const handleUpdateShiftSchedule = (dateStr: string, shiftId: number, isActive: boolean) => {
    const updatedCalendars = calendars.map(cal => {
      if (cal.id === activeCalendarId) {
        // Create a new shift schedule if it doesn't exist
        const shiftSchedule: ShiftSchedule = cal.shiftSchedule || {};
        
        // Create or update the entry for this date
        shiftSchedule[dateStr] = shiftSchedule[dateStr] || { shifts: {} };
        shiftSchedule[dateStr].shifts[shiftId] = isActive;
        
        return {
          ...cal,
          shiftSchedule
        };
      }
      return cal;
    });
    
    setCalendars(updatedCalendars);
    toast.success(`Shift schedule updated for ${format(parseISO(dateStr), 'MMM d, yyyy')}`);
  };

  // Handle deletion confirmation
  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'shift') {
      setShifts(shifts.filter(shift => shift.id !== itemToDelete.id));
      toast.success('Shift deleted successfully');
    } 
    else if (itemToDelete.type === 'holiday') {
      const updatedCalendars = calendars.map(cal => {
        if (cal.id === activeCalendarId) {
          return {
            ...cal,
            holidays: cal.holidays.filter(h => h.id !== itemToDelete.id)
          };
        }
        return cal;
      });
      
      setCalendars(updatedCalendars);
      toast.success('Holiday deleted successfully');
    }
    else if (itemToDelete.type === 'calendar') {
      // If trying to delete active calendar, switch to default calendar
      if (activeCalendarId === itemToDelete.id) {
        const defaultCal = calendars.find(cal => cal.isDefault);
        if (defaultCal) {
          setActiveCalendarId(defaultCal.id);
        }
      }
      
      setCalendars(calendars.filter(cal => cal.id !== itemToDelete.id));
      toast.success('Calendar deleted successfully');
    }
    
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Helper function to check if a date is a holiday
  const isHoliday = (date: Date) => {
    return activeCalendar?.holidays?.some(holiday => 
      isSameDay(new Date(holiday.date), date)
    ) || false;
  };

  // Helper function to check if a date is a workday
  const isWorkday = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    return activeCalendar?.workdaysPattern?.[dayOfWeek as keyof typeof activeCalendar.workdaysPattern] || false;
  };

  // Helper function to get holiday for a date
  const getHolidayForDate = (date: Date) => {
    return activeCalendar?.holidays?.find(holiday => 
      isSameDay(new Date(holiday.date), date)
    );
  };

  // Calendar day renderer with holiday highlighting
  const renderCalendarDay = (date: Date) => {
    const isToday = isSameDay(date, new Date());
    const holiday = getHolidayForDate(date);
    const isNonWorkingDay = !isWorkday(date);
    
    const classes = [
      "relative",
      holiday ? "bg-red-100 hover:bg-red-200" : "",
      isNonWorkingDay && !holiday ? "bg-gray-50" : "",
    ].filter(Boolean).join(" ");
    
    if (classes) {
      return (
        <div className={classes}>
          <div className="relative h-full w-full">
            {holiday && (
              <div className="absolute -top-1 -right-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            )}
            {date.getDate()}
          </div>
        </div>
      );
    }
    
    return <>{date.getDate()}</>;
  };

  // Selected day info
  const selectedDayHoliday = selectedDate ? getHolidayForDate(selectedDate) : undefined;
  const selectedDayIsWorkday = selectedDate ? isWorkday(selectedDate) : false;

  return (
    <DashboardLayout 
      title="Calendar" 
      description="Manage shift planning, holidays and workdays"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <Select
            value={activeCalendarId}
            onValueChange={(value) => setActiveCalendarId(value)}
          >
            <SelectTrigger className="w-[220px]">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Calendar" />
            </SelectTrigger>
            <SelectContent>
              {calendars.map((calendar) => (
                <SelectItem key={calendar.id} value={calendar.id}>
                  {calendar.name} {calendar.isDefault && "(Default)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleDeleteCalendar(activeCalendarId)}
            disabled={activeCalendar.isDefault}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Calendar
          </Button>
          <Button size="sm" onClick={handleAddCalendar}>
            <Globe className="mr-2 h-4 w-4" />
            Add Calendar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Calendar View</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditCalendar(activeCalendar)}
                disabled={activeCalendar.isDefault}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Settings
              </Button>
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-1" />
              {activeCalendar.name} ({activeCalendar.countryCode})
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border-0"
                modifiers={{
                  holiday: (date) => isHoliday(date),
                  weekend: (date) => isWeekend(date),
                  nonWorkday: (date) => !isWorkday(date) && !isHoliday(date),
                }}
                modifiersStyles={{
                  holiday: { backgroundColor: 'rgba(248, 113, 113, 0.2)' },
                  nonWorkday: { backgroundColor: 'rgba(229, 231, 235, 0.5)' },
                }}
                components={{
                  DayContent: ({ date }) => renderCalendarDay(date),
                }}
              />
            </div>
            
            {selectedDate && (
              <div className="p-4 border-t">
                <h3 className="text-sm font-medium mb-2">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                {selectedDayHoliday && (
                  <div className="p-2 bg-red-50 rounded-md border border-red-100 flex items-start mb-3">
                    <Info className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-600">{selectedDayHoliday.name}</p>
                      {selectedDayHoliday.description && (
                        <p className="text-xs text-red-600 mt-1">{selectedDayHoliday.description}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {!selectedDayIsWorkday && !selectedDayHoliday && (
                  <div className="p-2 bg-gray-50 rounded-md border border-gray-100 flex items-center mb-3">
                    <AlertTriangle className="text-gray-500 h-4 w-4 mr-2" />
                    <span className="text-sm text-gray-600">
                      Non-working day
                    </span>
                  </div>
                )}
                
                <h3 className="text-sm font-medium mt-4 mb-2">Legend</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {shifts.map((shift) => {
                    const [bgColor, textColor] = shift.color.split(' ');
                    return (
                      <Badge key={shift.id} variant="outline" className={`${bgColor} ${textColor} hover:${bgColor}`}>
                        {shift.name}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-red-100 text-red-600 hover:bg-red-200">Holiday</Badge>
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 hover:bg-gray-200">Non-workday</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="weekdetails">
            <TabsList className="grid grid-cols-3 mb-6 animate-fade-in">
              <TabsTrigger value="weekdetails">Week Details</TabsTrigger>
              <TabsTrigger value="shifts">Shifts</TabsTrigger>
              <TabsTrigger value="holidays">Holidays</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekdetails" className="animate-slide-up">
              <WeekDetailView 
                calendar={activeCalendar}
                shifts={shifts}
                selectedDate={selectedDate || new Date()}
                onUpdateShiftSchedule={handleUpdateShiftSchedule}
              />
            </TabsContent>
            
            <TabsContent value="shifts" className="animate-slide-up">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Shift Planning
                    </CardTitle>
                    <CardDescription>
                      Configure daily shifts and assign teams
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddShift} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Shift
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shifts.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        No shifts defined yet. Click "Add Shift" to create one.
                      </div>
                    ) : (
                      shifts.map((shift) => {
                        const [bgColor, textColor] = shift.color.split(' ');
                        
                        return (
                          <div 
                            key={shift.id}
                            className="flex items-center p-4 rounded-lg border transition-all hover:shadow-sm"
                          >
                            <div className="mr-4">
                              <div className={`w-3 h-12 rounded ${bgColor}`}></div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{shift.name}</h3>
                              <div className="flex mt-1 text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" /> {shift.startTime} - {shift.endTime}
                              </div>
                            </div>
                            <div className="mr-4">
                              <Badge variant="outline" className="flex items-center">
                                <Users className="mr-1 h-3 w-3" />
                                {shift.team}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEditShift(shift)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteShift(shift.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="holidays" className="animate-slide-up">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="flex items-center">
                      <CalendarDays className="mr-2 h-5 w-5" />
                      Holidays
                    </CardTitle>
                    <CardDescription>
                      Manage holidays for {activeCalendar.name}
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddHoliday} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Holiday
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeCalendar.holidays.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        No holidays defined for this calendar. Click "Add Holiday" to create one.
                      </div>
                    ) : (
                      activeCalendar.holidays.map((holiday) => (
                        <div 
                          key={holiday.id}
                          className="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                              <CalendarDays className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{holiday.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(holiday.date), 'MMMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleEditHoliday(holiday)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteHoliday(holiday.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <ShiftEditModal
        shift={selectedShift}
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onSave={handleSaveShift}
      />
      
      <HolidayEditModal
        holiday={selectedHoliday}
        isOpen={isHolidayModalOpen}
        onClose={() => setIsHolidayModalOpen(false)}
        onSave={handleSaveHoliday}
      />
      
      <CalendarEditModal
        calendar={selectedCalendar}
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onSave={handleSaveCalendar}
      />
      
      {/* Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'shift' && "This will permanently delete this shift."}
              {itemToDelete?.type === 'holiday' && "This will permanently delete this holiday."}
              {itemToDelete?.type === 'calendar' && "This will permanently delete this calendar and all its holidays."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default CalendarPage;
