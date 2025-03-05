
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Users } from 'lucide-react';

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Mock data for shift planning
  const shifts = [
    { id: 1, name: 'Morning Shift', time: '06:00 - 14:00', team: 'Team A', color: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'Afternoon Shift', time: '14:00 - 22:00', team: 'Team B', color: 'bg-green-100 text-green-600' },
    { id: 3, name: 'Night Shift', time: '22:00 - 06:00', team: 'Team C', color: 'bg-purple-100 text-purple-600' },
  ];
  
  // Mock data for holidays
  const holidays = [
    { id: 1, name: 'New Year\'s Day', date: 'Jan 1, 2023' },
    { id: 2, name: 'Labor Day', date: 'May 1, 2023' },
    { id: 3, name: 'Christmas', date: 'Dec 25, 2023' },
  ];
  
  // Mock data for workdays pattern
  const workdaysPattern = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  };

  return (
    <DashboardLayout 
      title="Calendar" 
      description="Manage shift planning, holidays and workdays"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 animate-slide-up">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Select a date to view details</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border-0"
              />
            </div>
            
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium mb-2">Legend</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-600 hover:bg-blue-200">Morning</Badge>
                <Badge variant="outline" className="bg-green-100 text-green-600 hover:bg-green-200">Afternoon</Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-600 hover:bg-purple-200">Night</Badge>
                <Badge variant="outline" className="bg-red-100 text-red-600 hover:bg-red-200">Holiday</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="shifts">
            <TabsList className="grid grid-cols-3 mb-6 animate-fade-in">
              <TabsTrigger value="shifts">Shifts</TabsTrigger>
              <TabsTrigger value="holidays">Holidays</TabsTrigger>
              <TabsTrigger value="workdays">Workdays</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shifts" className="animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Shift Planning
                  </CardTitle>
                  <CardDescription>
                    Configure daily shifts and assign teams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shifts.map((shift) => (
                      <div 
                        key={shift.id}
                        className="flex items-center p-4 rounded-lg border transition-all hover:shadow-sm"
                      >
                        <div className="mr-4">
                          <div className={`w-3 h-12 rounded ${shift.color.split(' ')[0]}`}></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{shift.name}</h3>
                          <div className="flex mt-1 text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" /> {shift.time}
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline" className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {shift.team}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="holidays" className="animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Holidays
                  </CardTitle>
                  <CardDescription>
                    Manage company holidays and planned shutdowns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {holidays.map((holiday) => (
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
                            <p className="text-sm text-muted-foreground">{holiday.date}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Holiday</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="workdays" className="animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Workdays Pattern
                  </CardTitle>
                  <CardDescription>
                    Configure which days of the week are working days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-4">
                    {Object.entries(workdaysPattern).map(([day, isWorkday]) => (
                      <div key={day} className="text-center">
                        <div className={`
                          w-12 h-12 mx-auto rounded-full flex items-center justify-center
                          ${isWorkday ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}
                        `}>
                          {day.charAt(0).toUpperCase()}
                        </div>
                        <p className="mt-2 text-xs font-medium">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {isWorkday ? 'Workday' : 'Off'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
