import React, {createContext, useState, useCallback, useMemo, useEffect, useContext} from 'react';
import { calendarApi } from '../services/calendarApi';
import { useAuth } from './AuthContext';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarRef, setCalendarRef] = useState(null);
    const [calendars, setCalendars] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const transformCalendar = useCallback((serverCalendar) => {
        const isSystemCalendar = serverCalendar.owner === null;

        return {
            id: serverCalendar.id,
            name: serverCalendar.title,
            color: serverCalendar.color || '#9e9e9e',
            visible: true,
            isOwner: isSystemCalendar ? true : (user ? serverCalendar.owner === user.id : false),
            isSystemCalendar: isSystemCalendar,
            canDelete: !isSystemCalendar,
            canShare: !isSystemCalendar
        };
    }, [user]);

    useEffect(() => {
        const fetchCalendars = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const res = await calendarApi.getCalendars();
                const transformedCalendars = res.data.calendars.map(transformCalendar);
                setCalendars(transformedCalendars);
            } catch (error) {
                console.error('Failed to fetch calendars:', error);
                setCalendars([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendars();
    }, [user, transformCalendar]);

    const updateDate = useCallback((date) => {
        setCurrentDate(new Date(date));
    }, []);

    const registerCalendarRef = useCallback((ref) => {
        setCalendarRef(ref);
    }, []);

    const refreshCalendars = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const res = await calendarApi.getCalendars();
            const transformedCalendars = res.data.calendars.map(transformCalendar);
            setCalendars(transformedCalendars);
        } catch (error) {
            console.error('Failed to refresh calendars:', error);
        } finally {
            setLoading(false);
        }
    }, [user, transformCalendar]);

    const myCalendars = useMemo(() => {
        const owned = calendars.filter(cal => cal.isOwner === true);
        return owned.sort((a, b) => {
            if (a.isSystemCalendar && !b.isSystemCalendar) return -1;
            if (!a.isSystemCalendar && b.isSystemCalendar) return 1;
            return 0;
        });
    }, [calendars]);

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