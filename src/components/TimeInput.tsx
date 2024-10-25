import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import type { TimeSlot } from '../types';

interface TimeInputProps {
  onSubmit: (timeSlot: TimeSlot) => void;
}

function TimeInput({ onSubmit }: TimeInputProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startTime || !endTime) return;
    
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    
    if (end <= start) {
      alert('End time must be after start time');
      return;
    }

    onSubmit({ start: startTime, end: endTime });
    setStartTime('');
    setEndTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        <Clock className="w-5 h-5 mr-2" />
        Add Time Slot
      </button>
    </form>
  );
}

export default TimeInput;