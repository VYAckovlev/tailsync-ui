import React, { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Calendar from '../../../components/Calendar/Calendar.jsx';
import { useCalendar } from '../../../hooks/useCalendar.js';
import './CalendarWeek.css';

const CalendarWeek = () => {
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
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const MOCK_EVENTS = [
        {
            id: '1',
            title: 'first event',
            start: today.toISOString().split('T')[0] + 'T10:00:00',
            end: today.toISOString().split('T')[0] + 'T11:30:00',
            color: '#2563eb'
        },
        {
            id: '2',
            title: 'second event',
            start: tomorrow.toISOString().split('T')[0] + 'T14:00:00',
            end: tomorrow.toISOString().split('T')[0] + 'T15:00:00',
            color: '#dc2626'
        },
        {
            id: '3',
            title: 'Some event for 3 days',
            start: nextWeek.toISOString().split('T')[0] + 'T09:00:00',
            end: new Date(nextWeek.setDate(nextWeek.getDate() + 3)).toISOString().split('T')[0] + 'T17:00:00',
            color: '#16a34a'
        }
    ];

    const events = contextData?.events?.length > 0 ? contextData.events : MOCK_EVENTS;
    const handleDateClick = contextData?.handleDateClick || ((arg) => alert(`Click on data: ${arg.dateStr}`));
    const handleEventClick = contextData?.handleEventClick || ((info) => alert(`Event: ${info.event.title}`));

    const handleDatesSet = (dateInfo) => {
        setCurrentDate(dateInfo.view.currentStart);
    };

    return (
        <div className="calendar-week-container">
            <Calendar
                ref={calendarRef}
                view="timeGridWeek"
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onDatesSet={handleDatesSet}
                extraOptions={{
                    firstDay: 0,
                    slotMinTime: '00:00:00',
                    slotMaxTime: '24:00:00',
                    slotDuration: '00:30:00',
                    slotLabelInterval: '01:00:00',
                    slotLabelFormat: {
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: 'short'
                    },
                    allDaySlot: true,
                    nowIndicator: true,
                    scrollTime: '08:00:00'
                }}
            />
        </div>
    );
};

export default CalendarWeek;