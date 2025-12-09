import React, { useRef, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar.jsx';
import { useCalendar } from '../../../context/CalendarContext.jsx';
import { useEvents } from '../../../context/EventsContext';
import './CalendarWeek.css';

const CalendarWeek = () => {
    const calendarRef = useRef(null);
    const { registerCalendarRef, updateDate } = useCalendar();
    const { events, handleDateClick, handleEventClick, handleEventDrop, renderEventContent } = useEvents();

    useEffect(() => {
        if (calendarRef.current) {
            registerCalendarRef(calendarRef.current);
            updateDate(calendarRef.current.getApi().getDate());
        }
    }, [registerCalendarRef, updateDate]);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);


    const handleDatesSet = (dateInfo) => {
        updateDate(dateInfo.view.currentStart);
    };

    return (
        <div className="calendar-week-container">
            <Calendar
                ref={calendarRef}
                view="timeGridWeek"
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                eventContent={renderEventContent}
                onDatesSet={handleDatesSet}
                extraOptions={{
                    firstDay: 1,
                    slotMinTime: '00:00:00',
                    slotMaxTime: '24:00:00',
                    slotDuration: '00:30:00',
                    slotLabelInterval: '01:00:00',
                    slotLabelFormat: {
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: 'short'
                    },
                    allDaySlot: false,
                    nowIndicator: true,
                    scrollTime: '08:00:00',
                    eventDrop: handleEventDrop
                }}
            />
        </div>
    );
};

export default CalendarWeek;