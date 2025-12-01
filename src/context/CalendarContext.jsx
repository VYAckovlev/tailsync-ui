import React, {createContext, useState, useCallback, useMemo, useEffect, useContext} from 'react';
import { calendarApi } from '../services/calendarApi';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarRef, setCalendarRef] = useState(null);
    const [calendars, setCalendars] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCalendars = async () => {
            setLoading(true);
            try {
                const response = await calendarApi.listCalendars();
                setCalendars(response.data || []);
            } catch (error) {
                console.error('Failed to fetch calendars:', error);
                setCalendars([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendars();
    }, []);

    const updateDate = useCallback((date) => {
        setCurrentDate(new Date(date));
    }, []);

    const registerCalendarRef = useCallback((ref) => {
        setCalendarRef(ref);
    }, []);

    const value = useMemo(() => ({
        currentDate,
        calendarRef,
        calendars,
        isLoading,
        updateDate,
        registerCalendarRef
    }), [currentDate, calendarRef, calendars, isLoading, updateDate, registerCalendarRef]);

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