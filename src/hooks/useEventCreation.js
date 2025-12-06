import { useState, useEffect, useMemo } from 'react';
import { eventApi } from '../services/eventApi.js';
import { useCalendar } from '../context/CalendarContext.jsx';
import toast from 'react-hot-toast';

export const useEventCreation = () => {
    const { calendars, currentDate } = useCalendar();
    const [isEventPopoverOpen, setIsEventPopoverOpen] = useState(false);
    const [popoverAnchorPosition, setPopoverAnchorPosition] = useState({ x: 0, y: 0 });
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventType, setEventType] = useState('arrangement');
    const [events, setEvents] = useState([]);
    const [shouldRefreshEvents, setShouldRefreshEvents] = useState(0);

    const [isEventDetailsPopoverOpen, setIsEventDetailsPopoverOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventDetailsPosition, setEventDetailsPosition] = useState({ x: 0, y: 0 });

    const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate]);
    const currentMonth = useMemo(() => currentDate.getMonth() + 1, [currentDate]);

    useEffect(() => {
        fetchEvents();
    }, [shouldRefreshEvents, calendars, currentYear, currentMonth]);

    const fetchEvents = async () => {
        try {
            const visibleCalendars = calendars.filter(cal => cal.visible);

            if (visibleCalendars.length === 0) {
                setEvents([]);
                return;
            }

            const eventPromises = visibleCalendars.map(calendar =>
                eventApi.getEventsByCalendar(calendar.id, 'all', currentYear)
                    .catch(error => {
                        console.error(`Failed to fetch events for calendar ${calendar.id}:`, error);
                        return { data: { events: [] } };
                    })
            );

            const responses = await Promise.all(eventPromises);
            const allEvents = responses.flatMap(response => response.data.events || []);

            const transformedEvents = allEvents.map(event => {
                const transformed = { ...event };

                if (event.calendar) {
                    transformed.calendar_id = event.calendar;
                }

                if (event.rrule) {
                    transformed.recurrence = event.rrule;
                }

                if (event.type) {
                    transformed.type = event.type.toLowerCase();
                }

                if (transformed.type === 'holiday' && (!event.id || event.id === '')) {
                    const sanitizedTitle = event.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'holiday';
                    transformed.id = `holiday-${event.start}-${sanitizedTitle}`;
                }

                if (transformed.type === 'holiday' && !event.color) {
                    transformed.color = '#fb8c00';
                }

                if (transformed.type === 'holiday') {
                    transformed.editable = false;
                }

                if (event.color && !event.backgroundColor) {
                    transformed.backgroundColor = event.color;
                }

                return transformed;
            });

            setEvents(transformedEvents);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setEvents([]);
        }
    };

    const calculatePopoverPosition = (jsEvent) => {
        const OFFSET_X = 10;
        const OFFSET_Y = 10;
        const POPOVER_WIDTH = 400;
        const POPOVER_HEIGHT = 600;

        let x = jsEvent.pageX + OFFSET_X;
        let y = jsEvent.pageY + OFFSET_Y;

        if (x + POPOVER_WIDTH > window.innerWidth) {
            x = jsEvent.pageX - POPOVER_WIDTH - OFFSET_X;
        }

        if (y + POPOVER_HEIGHT > window.innerHeight + window.scrollY) {
            y = jsEvent.pageY - POPOVER_HEIGHT - OFFSET_Y;
        }

        x = Math.max(OFFSET_X, x);
        y = Math.max(OFFSET_Y, y);

        return { x, y };
    };

    const handleDateClick = (arg) => {
        const { jsEvent, dateStr, date, allDay } = arg;

        const position = calculatePopoverPosition(jsEvent);
        setPopoverAnchorPosition(position);

        setSelectedDate({
            dateStr,
            date,
            allDay: allDay !== undefined ? allDay : true
        });

        setEventType('arrangement');

        setIsEventPopoverOpen(true);
    };

    const handleEventSubmit = async (eventData) => {
        try {
            await eventApi.createEvent(eventData);
            toast.success('Event created successfully');
            setIsEventPopoverOpen(false);

            setShouldRefreshEvents(prev => prev + 1);
        } catch (error) {
            console.error('Failed to create event:', error);
            toast.error('Failed to create event');
            throw error;
        }
    };

    const handleEventClick = (info) => {
        const event = info.event;
        const eventType = event.extendedProps?.type || 'arrangement';
        const meetingLink = event.extendedProps?.location;

        if (eventType === 'holiday') {
            return;
        }

        if (eventType === 'arrangement' && meetingLink) {
            window.open(meetingLink, '_blank');
            return;
        }

        const position = calculatePopoverPosition(info.jsEvent);
        openEventDetails(info, position);
    };

    const openEventDetails = (eventInfo, position) => {
        const event = eventInfo.event;
        const eventType = event.extendedProps?.type || 'arrangement';

        const eventData = {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            backgroundColor: event.backgroundColor,
            color: event.backgroundColor,
            type: eventType,
            description: event.extendedProps?.description || '',
            location: event.extendedProps?.location || '',
            calendarId: event.extendedProps?.calendar || event.extendedProps?.calendar_id || '',
            link: event.extendedProps?.link || '',
            completed: eventType === 'task' ? (event.extendedProps?.completed || false) : undefined,
            recurrence: event.extendedProps?.rrule || '',
        };

        setSelectedEvent(eventData);
        setEventDetailsPosition(position);
        setIsEventDetailsPopoverOpen(true);
    };

    const handleEventUpdate = async (eventId, eventData) => {
        try {
            await eventApi.updateEvent(eventId, eventData);
            toast.success('Event updated successfully');
            setIsEventDetailsPopoverOpen(false);
            setShouldRefreshEvents(prev => prev + 1);
        } catch (error) {
            console.error('Failed to update event:', error);
            toast.error('Failed to update event');
            throw error;
        }
    };

    const handleEventDelete = async (eventId) => {
        try {
            await eventApi.deleteEvent(eventId);
            toast.success('Event deleted successfully');
            setIsEventDetailsPopoverOpen(false);
            setShouldRefreshEvents(prev => prev + 1);
        } catch (error) {
            console.error('Failed to delete event:', error);
            toast.error('Failed to delete event');
            throw error;
        }
    };

    const handleEventDrop = async (info) => {
        const { event, revert } = info;
        const updatedEvent = {
            start: event.start.toISOString(),
            end: event.end ? event.end.toISOString() : null,
            allDay: event.allDay,
            title: event.title,
            color: event.backgroundColor,
            calendar: event.extendedProps?.calendar_id,
            type: event.extendedProps?.type,
            description: event.extendedProps?.description,
            location: event.extendedProps?.location,
            recurrence: event.extendedProps?.rrule,
        };

        try {
            await eventApi.updateEvent(event.id, updatedEvent);
            toast.success('Event updated successfully');
            setShouldRefreshEvents(prev => prev + 1);
        } catch (error) {
            revert();
            console.error('Failed to update event:', error);
            toast.error('Failed to update event');
        }
    }

    const closeEventPopover = () => {
        setIsEventPopoverOpen(false);
    };

    const closeEventDetailsPopover = () => {
        setIsEventDetailsPopoverOpen(false);
        setSelectedEvent(null);
    };

    const refreshEvents = () => {
        setShouldRefreshEvents(prev => prev + 1);
    };

    return {
        isEventPopoverOpen,
        popoverAnchorPosition,
        selectedDate,
        eventType,

        events,
        refreshEvents,

        handleDateClick,
        handleEventClick,

        handleEventSubmit,
        closeEventPopover,

        isEventDetailsPopoverOpen,
        selectedEvent,
        eventDetailsPosition,
        calculatePopoverPosition,
        openEventDetails,
        handleEventUpdate,
        handleEventDelete,
        handleEventDrop,
        closeEventDetailsPopover,
    };
};