import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

const Calendar = ({
                      view,
                      events,
                      onDateClick,
                      onEventClick,
                      extraOptions = {}
                  }) => {

    const defaultOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: false,
        editable: true,
        selectable: true,
        dayMaxEvents: true,
        height: "100%",
        locale: 'en-gb',
        firstDay: 1,
    };
    return (
        <div className="calendar-wrapper">
            <FullCalendar
                {...defaultOptions}
                initialView={view}
                events={events}
                dateClick={onDateClick}
                eventClick={onEventClick}
                {...extraOptions}
            />
        </div>
    );
};

export default Calendar;