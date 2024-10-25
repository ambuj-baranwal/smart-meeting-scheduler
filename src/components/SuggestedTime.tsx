import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { TimeSlot } from '../types';

interface SuggestedTimeProps {
  slot: TimeSlot;
}

function SuggestedTime({ slot }: SuggestedTimeProps) {
  return (
    <div className="mt-8 bg-green-50 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-green-800">Suggested Meeting Time</h3>
      </div>
      <p className="text-green-700">
        {slot.start} - {slot.end}
      </p>
    </div>
  );
}

export default SuggestedTime;