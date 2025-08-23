import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from 'lucide-react';

interface DateSelectorProps {
  onDateSelect: (date: Date) => void;
  inline?: boolean;
}

export function DateSelector({ onDateSelect, inline = false }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  if (inline) {
    return (
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Select Date:
        </label>
        <div className="relative">
          <DatePicker 
            selected={selectedDate} 
            onChange={handleDateChange} 
            dateFormat="yyyy-MM-dd" 
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" 
          />
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Date
      </label>
      <div className="flex items-center relative">
        <DatePicker 
          selected={selectedDate} 
          onChange={handleDateChange} 
          dateFormat="yyyy-MM-dd" 
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
        />
        <CalendarIcon className="absolute left-3 text-gray-400" size={16} />
      </div>
    </div>
  );
}
