
export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  team: string;
  color: string;
}

export interface Holiday {
  id: number;
  name: string;
  date: Date;
  description?: string;
}

export interface WorkdaysPattern {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface Calendar {
  id: string;
  name: string;
  countryCode: string;
  isDefault: boolean;
  holidays: Holiday[];
  workdaysPattern: WorkdaysPattern;
}
