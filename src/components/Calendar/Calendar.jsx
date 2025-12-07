import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import './Calendar.css';
import multiMonthPlugin from '@fullcalendar/multimonth';

const Calendar = React.forwardRef(({
                      view,
                      events,
                      onDateClick,
                      onEventClick,
                      eventContent,
                      onDatesSet,
                      extraOptions = {}
                  }, ref) => {

    const defaultOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin, rrulePlugin],
        headerToolbar: false,
        resizable: false,
        editable: true,
        eventStartEditable: true,
        eventDurationEditable: false,
        selectable: true,
        dayMaxEvents: true,
        height: "100%",
        locale: 'en-gb',
        firstDay: 1,
        datesSet: onDatesSet,
        eventDisplay: 'block',
        eventContent: eventContent,
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