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

    useEffect(() => {
        fetchEvents();
    }, [shouldRefreshEvents]);

    const fetchEvents = async () => {
        try {
            const response = await eventApi.getAllEvents();
            setEvents(response.data || []);
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
        console.log('Event clicked:', info.event);
        alert(`Event: ${info.event.title}`);
    };

    const closeEventPopover = () => {
        setIsEventPopoverOpen(false);
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
    };
};