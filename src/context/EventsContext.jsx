import { createContext, useContext } from 'react';
import { useEventCreation } from '../hooks/useEventCreation';
import { createEventContentRenderer } from '../components/EventContent/renderEventContent';

const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
    const eventLogic = useEventCreation();

    const renderEventContent = createEventContentRenderer(
        eventLogic.calculatePopoverPosition,
        eventLogic.openEventDetails
    );

    return (
        <EventsContext.Provider value={{...eventLogic, renderEventContent}}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (!context) throw new Error('useEvents must be used within EventsProvider');
    return context;
}