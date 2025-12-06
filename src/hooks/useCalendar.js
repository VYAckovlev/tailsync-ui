import {useCallback } from "react";
import { useCalendar } from '../context/CalendarContext.jsx';

export const useCalendarNavigation = () => {
    const { calendarRef, updateDate } = useCalendar();

    const goToNext = useCallback(() => {
        if (calendarRef) {
            const api = calendarRef.getApi();
            api.next();
            updateDate(api.getDate());
        }
    }, [calendarRef, updateDate]);

    const goToPrev = useCallback(() => {
        if (calendarRef) {
            const api = calendarRef.getApi();
            api.prev();
            updateDate(api.getDate());
        }
    }, [calendarRef, updateDate]);

    const goToToday = useCallback(() => {
        if (calendarRef) {
            const api = calendarRef.getApi();
            api.today();
            updateDate(new Date());
        }
    }, [calendarRef, updateDate]);

    const goToDate = useCallback((date) => {
        if (calendarRef) {
            const api = calendarRef.getApi();
            api.gotoDate(date);
            updateDate(new Date(date));
        }
    }, [calendarRef, updateDate]);

    return { goToNext, goToPrev, goToToday, goToDate };
};