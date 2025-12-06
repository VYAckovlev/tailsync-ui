import React, { useRef, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar.jsx';
import { useCalendar } from '../../../context/CalendarContext.jsx';
import { useEvents } from '../../../context/EventsContext';
import './CalendarYear.css';

const CalendarYear = () => {
    const calendarRef = useRef(null);
    const { registerCalendarRef, updateDate } = useCalendar();
    const { events, handleDateClick, handleEventClick } = useEvents();

    useEffect(() => {
        if (calendarRef.current) {
            registerCalendarRef(calendarRef.current);
            updateDate(calendarRef.current.getApi().getDate());
        }
    }, [registerCalendarRef, updateDate]);

    const handleDatesSet = (dateInfo) => {
        updateDate(dateInfo.view.currentStart);
    };

    return (
        <div className="calendar-year-container">
            <Calendar
                ref={calendarRef}
                view="multiMonthYear"
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onDatesSet={handleDatesSet}
                extraOptions={{
                    multiMonthMaxColumns: 4,
                    multiMonthMinWidth: 240,
                    fixedWeekCount: false,
                }}
            />
        </div>
    );
};

export default CalendarYear;