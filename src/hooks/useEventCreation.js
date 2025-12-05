import { useState, useEffect } from 'react';
import { eventApi } from '../services/eventApi.js';
import toast from 'react-hot-toast';

export const useEventCreation = () => {
    const [isEventPopoverOpen, setIsEventPopoverOpen] = useState(false);
    const [popoverAnchorPosition, setPopoverAnchorPosition] = useState({ x: 0, y: 0 });
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventType, setEventType] = useState('arrangement');
    const [events, setEvents] = useState([]);
    const [shouldRefreshEvents, setShouldRefreshEvents] = useState(0);

    const [isEventDetailsPopoverOpen, setIsEventDetailsPopoverOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventDetailsPosition, setEventDetailsPosition] = useState({ x: 0, y: 0 });


    useEffect(() => {
        fetchEvents();
    }, [shouldRefreshEvents]);

    const fetchEvents = async () => {
        try {
            const response = await eventApi.getAllEvents();
            setEvents(response.data.events || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
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
        const meetingLink = event.extendedProps?.link;

        if (eventType === 'arrangement' && meetingLink) {
            window.open(meetingLink, '_blank');
            return;
        }

        const position = calculatePopoverPosition(info.jsEvent);
        openEventDetails(info, position);
    };

    const openEventDetails = (eventInfo, position) => {
        const event = eventInfo.event;

        const eventData = {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            backgroundColor: event.backgroundColor,
            color: event.backgroundColor,
            type: event.extendedProps?.type || 'arrangement',
            description: event.extendedProps?.description || '',
            location: event.extendedProps?.location || '',
            calendarId: event.extendedProps?.calendar_id || event.extendedProps?.calendarId || '',
            link: event.extendedProps?.link || '',
        };

        setSelectedEvent(eventData);
        setEventDetailsPosition(position);
        setIsEventDetailsPopoverOpen(true);
    };

    const handleEventUpdate = async (eventId, eventData) => {
        try {
            const payload = {
                title: eventData.title,
                type: eventData.type,
                color: eventData.color,
                calendar_id: eventData.calendarId,
                description: eventData.description,
            };

            if (eventData.start) {
                payload.start = eventData.start;
            }

            if (eventData.end) {
                payload.end = eventData.end;
            }

            if (eventData.location) {
                payload.location = eventData.location;
            }

            if (eventData.link) {
                payload.link = eventData.link;
            }

            await eventApi.updateEvent(eventId, payload);
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

    const closeEventPopover = () => {
        setIsEventPopoverOpen(false);
    };

    const closeEventDetailsPopover = () => {
        setIsEventDetailsPopoverOpen(false);
        setSelectedEvent(null);
    };

    return {
        isEventPopoverOpen,
        popoverAnchorPosition,
        selectedDate,
        eventType,

        events,

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
        closeEventDetailsPopover,
    };
};