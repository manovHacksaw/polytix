import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Label } from "@/components/ui/label";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CustomDatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  disabled = false,
  error,
}) => {
  // Ensure end date can't be before start date
  const adjustedMinDate = startDate || minDate;
  // Ensure start date can't be after end date
  const adjustedMaxDate = endDate || maxDate;

  const handleStartDateChange = (date: Date | null) => {
    onStartDateChange(date);
    // If end date exists and is before new start date, clear it
    if (date && endDate && date > endDate) {
      onEndDateChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <Label htmlFor="startDate" className="block mb-2 text-sm font-medium">
            Start Date and Time
          </Label>
          <div className="relative">
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              timeFormat="h:mm aa"
              timeIntervals={15} // Optional: Adjust time intervals
              timeCaption="Time"
              dateFormat="MM/dd/yyyy h:mm aa"
              placeholderText="Select start date and time"
              minDate={minDate}
              maxDate={adjustedMaxDate}
              disabled={disabled}
              className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="endDate" className="block mb-2 text-sm font-medium">
            End Date and Time
          </Label>
          <div className="relative">
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={onEndDateChange}
              showTimeSelect
              timeFormat="h:mm aa"
              timeIntervals={15} // Optional: Adjust time intervals
              timeCaption="Time"
              dateFormat="MM/dd/yyyy h:mm aa"
              placeholderText="Select end date and time"
              minDate={adjustedMinDate}
              maxDate={maxDate}
              disabled={disabled || !startDate}
              className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {startDate && endDate && (
        <div className="text-sm text-gray-600">
          Selected range: {startDate.toLocaleString()} - {endDate.toLocaleString()}
          {" "}({Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
        </div>
      )}
    </div>
  );
};