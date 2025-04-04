
import { CalendarState } from '@/types/calendar';

export class CalendarService {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }
  
  getCalendarState(): CalendarState | null {
    // Deep clone the calendar data to prevent reference issues
    if (this.db.calendar) {
      console.log("Getting calendar state, current data:", this.db.calendar);
      return JSON.parse(JSON.stringify(this.db.calendar));
    }
    return this.db.calendar;
  }
  
  setCalendarState(calendarState: CalendarState): void {
    // Ensure all calendar properties have the correct structure
    if (!calendarState.shiftTimes) calendarState.shiftTimes = [];
    if (!calendarState.dayShiftToggles) calendarState.dayShiftToggles = [];
    if (!calendarState.holidays) calendarState.holidays = [];
    if (!calendarState.viewDate) calendarState.viewDate = new Date().toISOString().split('T')[0];
    
    // Make a deep clone of the calendar state to prevent reference issues
    this.db.calendar = JSON.parse(JSON.stringify(calendarState));
    console.log("Saving calendar state:", this.db.calendar);
  }
}
