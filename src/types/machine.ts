
export interface Machine {
  id: string;
  name: string;
  status: 'Operational' | 'Maintenance' | 'Offline';
  availability: number;
  setupTime: string;
  lastMaintenance: string;
  nextMaintenance: string;
  category?: string;
  hourlyCost?: number;
  labourPersonHour?: number;
  description?: string;
}
