import React, { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Calendar from '../../../components/Calendar/Calendar.jsx';
import { useCalendar } from '../../../hooks/useCalendar.js';
import './CalendarDay.css';

const CalendarDay = () => {
    const calendarRef = useRef(null);
    const { setCalendarRef, setCurrentDate } = useCalendar();
    const contextData = useOutletContext();

    useEffect(() => {
        if (calendarRef.current) {
            setCalendarRef(calendarRef.current);
            setCurrentDate(calendarRef.current.getApi().getDate());
        }
    }, [setCalendarRef, setCurrentDate]);

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

    const events = contextData?.events?.length > 0 ? contextData.events : MOCK_EVENTS;
    const handleDateClick = contextData?.handleDateClick || ((arg) => alert(`Click on data: ${arg.dateStr}`));
    const handleEventClick = contextData?.handleEventClick || ((info) => alert(`Event: ${info.event.title}`));

    const handleDatesSet = (dateInfo) => {
        setCurrentDate(dateInfo.view.currentStart);
    };

    return (
        <div className="calendar-day-container">
            <Calendar
                ref={calendarRef}
                view="timeGridDay"
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
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