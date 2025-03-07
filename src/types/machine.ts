
export interface Machine {
  id: number;
  name: string;
  status: 'Operational' | 'Maintenance' | 'Offline';
  availability: number;
  setupTime: string;
  lastMaintenance: string;
  nextMaintenance: string;
  category?: string;
  compatibleParts?: number[];
}
