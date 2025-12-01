import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';
import multiMonthPlugin from '@fullcalendar/multimonth';

const Calendar = React.forwardRef(({
                      view,
                      events,
                      onDateClick,
                      onEventClick,
                      onEventDidMount,
                      onDatesSet,
                      extraOptions = {}
                  }, ref) => {

    const defaultOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin],
        headerToolbar: false,
        editable: true,
        selectable: true,
        dayMaxEvents: true,
        height: "100%",
        locale: 'en-gb',
        firstDay: 1,
        datesSet: onDatesSet,
        eventDisplay: 'block',
        eventDidMount: onEventDidMount,
    };

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                ref={ref}
                {...defaultOptions}
                initialView={view}
                events={events}
                dateClick={onDateClick}
                eventClick={onEventClick}
                {...extraOptions}
            />
        </div>
    );
});

Calendar.displayName = 'Calendar';

export default Calendar;