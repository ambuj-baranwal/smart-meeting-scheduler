import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import type { User } from '../types';

interface TimeSlotListProps {
  users: User[];
  onDelete: (userName: string, slotIndex: number) => void;
}

function TimeSlotList({ users, onDelete }: TimeSlotListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No time slots added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {users.map((user) => (
        <div key={user.name} className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{user.name}</h3>
          <div className="space-y-2">
            {user.timeSlots.map((slot, slotIndex) => (
              <div
                key={slotIndex}
                className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm group"
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-indigo-600 mr-2" />
                  <span className="text-gray-600">
                    {slot.start} - {slot.end}
                  </span>
                </div>
                <button
                  onClick={() => onDelete(user.name, slotIndex)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Delete time slot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TimeSlotList;