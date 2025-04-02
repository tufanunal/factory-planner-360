
export type ShiftTime = {
  id: string;
  name: string; // Morning/Afternoon/Night
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string; // Format: "HH:MM" (24-hour)
  color: string; // CSS color string
};

export type DayShiftToggle = {
  id: string;
  date: string; // ISO date string: YYYY-MM-DD
  shiftTimeId: string;
  isActive: boolean;
};

export type Holiday = {
  id: string;
  name: string;
  date: string; // ISO date string: YYYY-MM-DD
  isRecurringYearly: boolean;
};

export interface CalendarState {
  shiftTimes: ShiftTime[];
  dayShiftToggles: DayShiftToggle[];
  holidays: Holiday[];
  viewDate: string; // ISO date string for current view: YYYY-MM-DD
}
