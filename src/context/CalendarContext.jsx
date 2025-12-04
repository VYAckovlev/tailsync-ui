import React, {createContext, useState, useCallback, useMemo, useEffect, useContext} from 'react';
import { calendarApi } from '../services/calendarApi';

const CalendarContext = createContext();

// Mock calendar data
const mockCalendars = [
    // My Calendars (isOwner: true)
    { id: 1, name: 'Personal', color: '#1e88e5', visible: true, isOwner: true },
    { id: 2, name: 'Work', color: '#e53935', visible: true, isOwner: true },
    { id: 3, name: 'Family', color: '#43a047', visible: false, isOwner: true },

    // Other Calendars (isOwner: false)
    { id: 4, name: 'Team Events', color: '#fb8c00', visible: true, isOwner: false },
    { id: 5, name: 'Holidays', color: '#8e24aa', visible: true, isOwner: false },
];

export const CalendarProvider = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarRef, setCalendarRef] = useState(null);
    const [calendars, setCalendars] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        // Using mock data for now
        setLoading(true);
        setCalendars(mockCalendars);
        setLoading(false);

        // TODO: Uncomment to use real API
        // const fetchCalendars = async () => {
        //     setLoading(true);
        //     try {
        //         const response = await calendarApi.listCalendars();
        //         setCalendars(response.data || []);
        //     } catch (error) {
        //         console.error('Failed to fetch calendars:', error);
        //         setCalendars([]);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchCalendars();
    }, []);

    const updateDate = useCallback((date) => {
        setCurrentDate(new Date(date));
    }, []);

    const registerCalendarRef = useCallback((ref) => {
        setCalendarRef(ref);
    }, []);

    const refreshCalendars = useCallback(async () => {
        setLoading(true);
        try {
            // When using real API:
            // const response = await calendarApi.listCalendars();
            // setCalendars(response.data || []);

            // For now with mock data:
            setCalendars(mockCalendars);
        } catch (error) {
            console.error('Failed to refresh calendars:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const myCalendars = useMemo(() =>
        calendars.filter(cal => cal.isOwner === true),
        [calendars]
    );

    const otherCalendars = useMemo(() =>
        calendars.filter(cal => cal.isOwner === false),
        [calendars]
    );

    const value = useMemo(() => ({
        currentDate,
        calendarRef,
        calendars,
        myCalendars,
        otherCalendars,
        isLoading,
        updateDate,
        registerCalendarRef,
        refreshCalendars
    }), [currentDate, calendarRef, calendars, myCalendars, otherCalendars, isLoading, updateDate, registerCalendarRef, refreshCalendars]);

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};