
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarType, WorkdaysPattern } from '@/types/calendar';
import { toast } from 'sonner';
import { DEFAULT_WORKDAYS_PATTERN } from '@/contexts/DataContext';

// Country codes (ISO 3166-1 alpha-2 and alpha-3)
const COUNTRY_CODES = [
  { code: 'INT', name: 'International' },
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'TR', name: 'Turkiye' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
];

interface CalendarEditModalProps {
  calendar: CalendarType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (calendar: CalendarType) => void;
  isDefault?: boolean;
}

const CalendarEditModal: React.FC<CalendarEditModalProps> = ({ 
  calendar, 
  isOpen, 
  onClose, 
  onSave,
  isDefault = false
}) => {
  const [formData, setFormData] = useState<CalendarType>({
    id: '',
    name: '',
    countryCode: 'INT',
    isDefault: false,
    holidays: [],
    workdaysPattern: { ...DEFAULT_WORKDAYS_PATTERN },
  });

  useEffect(() => {
    if (calendar) {
      setFormData({
        ...calendar,
        // Ensure workdaysPattern is not null
        workdaysPattern: calendar.workdaysPattern || { ...DEFAULT_WORKDAYS_PATTERN }
      });
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        countryCode: 'INT',
        isDefault: isDefault,
        holidays: [],
        workdaysPattern: { ...DEFAULT_WORKDAYS_PATTERN },
      });
    }
  }, [calendar, isOpen, isDefault]);

  const handleChange = (field: keyof CalendarType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkdayChange = (day: keyof WorkdaysPattern, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      workdaysPattern: {
        ...prev.workdaysPattern,
        [day]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Calendar name is required');
      return;
    }
    
    onSave(formData);
    toast.success(calendar ? 'Calendar updated successfully' : 'Calendar added successfully');
  };

  const daysOfWeek = [
    { key: 'monday' as keyof WorkdaysPattern, label: 'Monday' },
    { key: 'tuesday' as keyof WorkdaysPattern, label: 'Tuesday' },
    { key: 'wednesday' as keyof WorkdaysPattern, label: 'Wednesday' },
    { key: 'thursday' as keyof WorkdaysPattern, label: 'Thursday' },
    { key: 'friday' as keyof WorkdaysPattern, label: 'Friday' },
    { key: 'saturday' as keyof WorkdaysPattern, label: 'Saturday' },
    { key: 'sunday' as keyof WorkdaysPattern, label: 'Sunday' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{calendar ? 'Edit Calendar' : 'Add New Calendar'}</DialogTitle>
            <DialogDescription>
              {calendar ? 'Modify this calendar\'s details' : 'Create a new calendar for a specific country or region'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="col-span-3"
                placeholder="German Calendar"
                required
                disabled={formData.isDefault}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="countryCode" className="text-right">
                Country
              </Label>
              <select
                id="countryCode"
                value={formData.countryCode}
                onChange={(e) => handleChange('countryCode', e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={formData.isDefault}
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <Label className="font-medium">Workdays</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day.key} className="flex items-center space-x-2">
                    <Switch
                      id={day.key}
                      checked={formData.workdaysPattern[day.key]}
                      onCheckedChange={(checked) => handleWorkdayChange(day.key, checked)}
                      disabled={formData.isDefault}
                    />
                    <Label htmlFor={day.key}>{day.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEditModal;
