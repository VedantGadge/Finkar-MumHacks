import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css';

const CustomDatePicker = ({ selected, onChange, placeholderText = "Select date", dateFormat = "yyyy-MM-dd", ...props }) => {
    // Safely parse the date to avoid RangeError
    const parseDate = (dateValue) => {
        if (!dateValue) return null;

        // If it's already a Date object, return it
        if (dateValue instanceof Date) {
            return isNaN(dateValue.getTime()) ? null : dateValue;
        }

        // Try to parse the date string
        const parsedDate = new Date(dateValue);

        // Check if the date is valid
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    const safeSelected = parseDate(selected);

    return (
        <DatePicker
            selected={safeSelected}
            onChange={onChange}
            dateFormat={dateFormat}
            placeholderText={placeholderText}
            className="custom-date-input"
            calendarClassName="custom-calendar"
            showPopperArrow={false}
            {...props}
        />
    );
};

export default CustomDatePicker;
