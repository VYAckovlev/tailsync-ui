import React, { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ChronosCalendar from '../../../components/Calendar/Calendar.jsx';
import { useCalendar } from '../../../hooks/useCalendar.js';
import './CalendarMonth.css';

const CalendarMonth = () => {
    const calendarRef = useRef(null);
    const { setCalendarRef, setCurrentDate } = useCalendar();
    const contextData = useOutletContext();

    useEffect(() => {
        if (calendarRef.current) {
            setCalendarRef(calendarRef.current);
            setCurrentDate(calendarRef.current.getApi().getDate());
        }
    }, [setCalendarRef, setCurrentDate]);

    const MOCK_EVENTS = [
        {
            id: '1',
            title: 'Team Standup Meeting',
            start: '2025-11-05T09:00:00',
            end: '2025-11-05T09:30:00',
            backgroundColor: '#2563eb',
            borderColor: '#2563eb'
        },
        {
            id: '2',
            title: 'Client Presentation',
            start: '2025-11-08T14:30:00',
            end: '2025-11-08T16:00:00',
            backgroundColor: '#dc2626',
            borderColor: '#dc2626'
        },
        {
            id: '3',
            title: 'Project Review',
            start: '2025-11-12T10:00:00',
            end: '2025-11-12T11:00:00',
            backgroundColor: '#16a34a',
            borderColor: '#16a34a'
        },
        {
            id: '4',
            title: 'Lunch Break',
            start: '2025-11-15T12:00:00',
            end: '2025-11-15T13:00:00',
            backgroundColor: '#f59e0b',
            borderColor: '#f59e0b'
        },
        {
            id: '5',
            title: 'Design Workshop',
            start: '2025-11-18T15:00:00',
            end: '2025-11-18T17:00:00',
            backgroundColor: '#8b5cf6',
            borderColor: '#8b5cf6'
        },
        {
            id: '6',
            title: 'Sprint Planning',
            start: '2025-11-21T09:30:00',
            end: '2025-11-21T11:30:00',
            backgroundColor: '#06b6d4',
            borderColor: '#06b6d4'
        },
        {
            id: '7',
            title: 'Code Review Session',
            start: '2025-11-25T11:00:00',
            end: '2025-11-25T11:45:00',
            backgroundColor: '#ec4899',
            borderColor: '#ec4899'
        },
        {
            id: '8',
            title: 'All-Hands Meeting',
            start: '2025-11-28T16:00:00',
            end: '2025-11-28T17:00:00',
            backgroundColor: '#14b8a6',
            borderColor: '#14b8a6'
        }
    ];

    const events = contextData?.events?.length > 0 ? contextData.events : MOCK_EVENTS;
    const handleDateClick = contextData?.handleDateClick || ((arg) => alert(`Click on data: ${arg.dateStr}`));
    const handleEventClick = contextData?.handleEventClick || ((info) => alert(`Event: ${info.event.title}`));

    const handleDatesSet = (dateInfo) => {
        setCurrentDate(dateInfo.view.currentStart);
    };

    return (
        <div className="calendar-month-container">
            <ChronosCalendar
                ref={calendarRef}
                view="dayGridMonth"
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onDatesSet={handleDatesSet}
            />
        </div>
    );
};

export default CalendarMonth;