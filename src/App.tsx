import React, { useState } from 'react';
import { Calendar, Clock, Users, Check, X } from 'lucide-react';
import TimeInput from './components/TimeInput';
import TimeSlotList from './components/TimeSlotList';
import SuggestedTime from './components/SuggestedTime';
import { findOverlappingSlots } from './utils/timeUtils';
import type { TimeSlot, User } from './types';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState('');
  const [suggestedSlot, setSuggestedSlot] = useState<TimeSlot | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleAddTimeSlot = (timeSlot: TimeSlot) => {
    if (!currentUser.trim()) {
      showNotification('Please enter your name', 'error');
      return;
    }

    const existingUserIndex = users.findIndex(u => u.name === currentUser);
    if (existingUserIndex >= 0) {
      const updatedUsers = [...users];
      // Check for overlapping slots for the same user
      const hasOverlap = updatedUsers[existingUserIndex].timeSlots.some(
        existing => timeSlotOverlaps(existing, timeSlot)
      );
      
      if (hasOverlap) {
        showNotification('Time slot overlaps with your existing slots', 'error');
        return;
      }
      
      updatedUsers[existingUserIndex].timeSlots.push(timeSlot);
      setUsers(updatedUsers);
    } else {
      setUsers([...users, { name: currentUser, timeSlots: [timeSlot] }]);
    }
    
    showNotification('Time slot added successfully!', 'success');
    calculateSuggestedTime();
  };

  const handleDeleteTimeSlot = (userName: string, slotIndex: number) => {
    const updatedUsers = users.map(user => {
      if (user.name === userName) {
        return {
          ...user,
          timeSlots: user.timeSlots.filter((_, index) => index !== slotIndex)
        };
      }
      return user;
    }).filter(user => user.timeSlots.length > 0);
    
    setUsers(updatedUsers);
    calculateSuggestedTime();
    showNotification('Time slot deleted', 'success');
  };

  const calculateSuggestedTime = () => {
    if (users.length < 2) {
      setSuggestedSlot(null);
      return;
    }
    
    const allTimeSlots = users.flatMap(user => user.timeSlots);
    const overlappingSlot = findOverlappingSlots(allTimeSlots);
    setSuggestedSlot(overlappingSlot);
  };

  const timeSlotOverlaps = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
    const start1 = new Date(`1970-01-01T${slot1.start}`);
    const end1 = new Date(`1970-01-01T${slot1.end}`);
    const start2 = new Date(`1970-01-01T${slot2.start}`);
    const end2 = new Date(`1970-01-01T${slot2.end}`);

    return start1 < end2 && start2 < end1;
  };

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-800">Meeting Scheduler</h1>
          </div>
          <p className="text-gray-600">Find the perfect time for your team meeting</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-indigo-600" />
              Add Availability
            </h2>
            
            <div className="mb-6">
              <input
                type="text"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <TimeInput onSubmit={handleAddTimeSlot} />

            {notification.show && (
              <div className={`mt-4 p-3 rounded-lg ${
                notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              } flex items-center`}>
                {notification.type === 'error' ? 
                  <X className="w-5 h-5 mr-2" /> : 
                  <Check className="w-5 h-5 mr-2" />
                }
                {notification.message}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-indigo-600" />
              Time Slots
            </h2>
            
            <TimeSlotList users={users} onDelete={handleDeleteTimeSlot} />
            
            {suggestedSlot && <SuggestedTime slot={suggestedSlot} />}
            {users.length > 0 && !suggestedSlot && (
              <div className="mt-8 bg-yellow-50 rounded-lg p-4">
                <p className="text-yellow-700">
                  No common time slot found. Try adding more availability.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;