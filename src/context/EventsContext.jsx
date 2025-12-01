import { createContext, useContext } from 'react';
import { useEventCreation } from '../hooks/useEventCreation';

const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
    const eventLogic = useEventCreation();

    return (
        <EventsContext.Provider value={eventLogic}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (!context) throw new Error('useEvents must be used within EventsProvider');
    return context;
}