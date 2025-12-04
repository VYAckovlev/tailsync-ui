import React, { useRef, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar.jsx';
import { useCalendar } from '../../../context/CalendarContext.jsx';
import { useEvents } from '../../../context/EventsContext';
import './CalendarDay.css';

const CalendarDay = () => {
    const calendarRef = useRef(null);
    const { registerCalendarRef, updateDate } = useCalendar();
    const { events, handleDateClick, handleEventClick, renderEventContent } = useEvents();

    useEffect(() => {
        if (calendarRef.current) {
            registerCalendarRef(calendarRef.current);
            updateDate(calendarRef.current.getApi().getDate());
        }
    }, [registerCalendarRef, updateDate]);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const MOCK_EVENTS = [
        {
            id: '1',
            title: 'Morning Meeting',
            start: `${today.toISOString().split('T')[0]}T09:00:00`,
            end: `${today.toISOString().split('T')[0]}T10:00:00`,
            color: '#2563eb'
        },
        {
            id: '2',
            title: 'Lunch Break',
            start: `${today.toISOString().split('T')[0]}T12:00:00`,
            end: `${today.toISOString().split('T')[0]}T13:00:00`,
            color: '#16a34a'
        },
        {
            id: '3',
            title: 'Project Review',
            start: `${today.toISOString().split('T')[0]}T15:00:00`,
            end: `${today.toISOString().split('T')[0]}T16:30:00`,
            color: '#dc2626'
        }
    ];

    const displayEvents = events?.length > 0 ? events : MOCK_EVENTS;

    const handleDatesSet = (dateInfo) => {
        updateDate(dateInfo.view.currentStart);
    };

    return (
        <div className="calendar-day-container">
            <Calendar
                ref={calendarRef}
                view="timeGridDay"
                events={displayEvents}
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
                    },
                    scrollTime: '08:00:00',
                    scrollTimeReset: false,
                    nowIndicator: true
                }}
            />
        </div>
    );
}

export default CalendarDay;