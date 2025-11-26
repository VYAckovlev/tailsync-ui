import React, { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Calendar from '../../../components/Calendar/Calendar.jsx';
import { useCalendar } from '../../../hooks/useCalendar.js';
import './CalendarYear.css';

const CalendarYear = () => {
    const calendarRef = useRef(null);
    const { setCalendarRef, setCurrentDate } = useCalendar();
    const contextData = useOutletContext();

    useEffect(() => {
        if (calendarRef.current) {
            setCalendarRef(calendarRef.current);
            setCurrentDate(calendarRef.current.getApi().getDate());
        }
    }, [setCalendarRef, setCurrentDate]);

    const events = contextData?.events || [];
    const handleDateClick = contextData?.handleDateClick || ((arg) => {
        console.log('Data click (Year View):', arg);
    });
    const handleEventClick = contextData?.handleEventClick || ((info) => {
        console.log('Event click:', info.event);
    });

    const handleDatesSet = (dateInfo) => {
        setCurrentDate(dateInfo.view.currentStart);
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