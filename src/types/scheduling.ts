export interface Staff {
  id: string;
  name: string;
  position: string;
  day_off: string;
}

export interface AvailableStaff {
  available_staff: Record<string, Staff[]>;
  requirements: Record<string, number>;
}

export interface Shift {
  id: string;
  date: string;
  scheduled_staff: Record<string, string[]>;
}

export interface WorkHistoryStats {
  [staffName: string]: number;
}

export interface ShiftAssignment {
  id: string;
  name: string;
  role: string;
}

export interface WeekDay {
  name: string;
  date?: string;
}
