import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from 'lucide-react';

interface DateSelectorProps {
  onDateSelect: (date: Date) => void;
  inline?: boolean;
}

export function DateSelector({ onDateSelect, inline = false }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<DatePicker>(null);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
      // Force close the date picker after selection
      setIsOpen(false);
      // Also use the ref method as a backup
      if (datePickerRef.current) {
        datePickerRef.current.setOpen(false);
      }
    }
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  if (inline) {
    return (
      <div className="flex items-center w-full">
        <label className="hidden sm:inline text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
          Select Date:
        </label>
        <div className="relative w-full">
          <DatePicker 
            ref={datePickerRef}
            selected={selectedDate}
            onChange={handleDateChange}
            open={isOpen}
            onInputClick={handleInputClick}
            onClickOutside={() => setIsOpen(false)}
            dateFormat="yyyy-MM-dd"
            className="w-full pl-8 pr-2 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
            placeholderText="Date"
            shouldCloseOnSelect={true}
            autoFocus={false}
          />
          <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
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
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          open={isOpen}
          onInputClick={handleInputClick}
          onClickOutside={() => setIsOpen(false)}
          dateFormat="yyyy-MM-dd"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          shouldCloseOnSelect={true}
          autoFocus={false}
        />
        <CalendarIcon className="absolute left-3 text-gray-400" size={16} />
      </div>
    </div>
  );
}
