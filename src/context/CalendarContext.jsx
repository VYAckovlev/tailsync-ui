import React, { createContext, useState } from 'react';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarRef, setCalendarRef] = useState(null);

    const goToNext = () => {
        if (calendarRef) {
            const api = calendarRef.getApi();
            api.next();
            setCurrentDate(api.getDate());
        }
    };

    const goToPrev = () => {
        if (calendarRef) {
            const api = calendarRef.getApi();
            api.prev();
            setCurrentDate(api.getDate());
        }
    };

    const goToToday = () => {
        if (calendarRef) {
            const api = calendarRef.getApi();
            api.today();
            setCurrentDate(new Date());
        }
    };

    const goToDate = (date) => {
        if (calendarRef) {
            const api = calendarRef.getApi();
            api.gotoDate(date);
            setCurrentDate(new Date(date));
        }
    };

    const value = {
        currentDate,
        setCurrentDate,
        calendarRef,
        setCalendarRef,
        goToNext,
        goToPrev,
        goToToday,
        goToDate
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
};

export default CalendarContext;