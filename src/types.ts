export interface TimeSlot {
  start: string;
  end: string;
}

export interface User {
  name: string;
  timeSlots: TimeSlot[];
}