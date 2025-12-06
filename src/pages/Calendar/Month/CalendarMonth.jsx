import React, { useRef, useEffect } from 'react';
import ChronosCalendar from '../../../components/Calendar/Calendar.jsx';
import { useCalendar } from '../../../context/CalendarContext.jsx';
import { useEvents } from '../../../context/EventsContext';
import './CalendarMonth.css';

const CalendarMonth = () => {
    const calendarRef = useRef(null);
    const { registerCalendarRef, updateDate } = useCalendar();
    const { events, handleDateClick, handleEventClick, handleEventDrop, renderEventContent } = useEvents();

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
        <div className="calendar-month-container">
            <ChronosCalendar
                ref={calendarRef}
                view="dayGridMonth"
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                eventContent={renderEventContent}
                onDatesSet={handleDatesSet}
                extraOptions={{
                    eventDrop: handleEventDrop
                }}
            />
        </div>
    );
};

export default CalendarMonth;