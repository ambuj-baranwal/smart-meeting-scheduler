import type { TimeSlot } from '../types';

export function findOverlappingSlots(timeSlots: TimeSlot[]): TimeSlot | null {
  if (timeSlots.length < 2) return null;

  // Group time slots by userId for distinct user overlaps
  const userSlots = new Map<string, TimeSlot[]>();
  timeSlots.forEach(slot => {
    const userId = slot.userId;
    if (!userSlots.has(userId)) {
      userSlots.set(userId, []);
    }
    userSlots.get(userId)?.push(slot);
  });

  // Convert all slots to minute ranges for easier comparison
  const slotsInMinutes: { start: number; end: number }[] = [];
  userSlots.forEach(slots => {
    slots.forEach(slot => {
      slotsInMinutes.push({
        start: timeToMinutes(slot.start),
        end: timeToMinutes(slot.end)
      });
    });
  });

  // Find common time ranges
  let commonRanges = [slotsInMinutes[0]];
  for (let i = 1; i < slotsInMinutes.length; i++) {
    const currentSlot = slotsInMinutes[i];
    const newRanges = [];

    for (const range of commonRanges) {
      const overlapStart = Math.max(range.start, currentSlot.start);
      const overlapEnd = Math.min(range.end, currentSlot.end);

      if (overlapStart < overlapEnd) {
        newRanges.push({ start: overlapStart, end: overlapEnd });
      }
    }

    commonRanges = newRanges;
    if (commonRanges.length === 0) break;
  }

  // If we found common ranges, return the first one
  if (commonRanges.length > 0) {
    return {
      start: minutesToTime(commonRanges[0].start),
      end: minutesToTime(commonRanges[0].end)
    };
  }

  return null;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function doSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  const start1 = timeToMinutes(slot1.start);
  const end1 = timeToMinutes(slot1.end);
  const start2 = timeToMinutes(slot2.start);
  const end2 = timeToMinutes(slot2.end);

  return start1 < end2 && start2 < end1;
}
